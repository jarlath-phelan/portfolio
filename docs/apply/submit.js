/**
 * GitHub Pages selection form for the daily "Pick One and Apply" pipeline.
 *
 * Loads data.json, renders role cards using safe DOM construction,
 * and dispatches via Cloudflare Worker proxy to trigger tailoring.
 */

const WORKER_URL = "https://apply-dispatch.jarlath-career.workers.dev";
const DATA_FILE = "data.json";

let selectedRoles = new Set();
let rolesData = [];

// --- Data loading ---

async function loadRoles() {
  var container = document.getElementById("roles-container");
  try {
    var resp = await fetch(DATA_FILE);
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    var data = await resp.json();
    rolesData = data.roles || [];
    renderRoles(rolesData, container);
  } catch (_err) {
    container.textContent = "";
    var msg = document.createElement("div");
    msg.className = "empty";
    msg.textContent = "No roles available today. Check back at 6 PM ET.";
    container.appendChild(msg);
  }
}

// --- Rendering (safe DOM construction) ---

function createScoreBar(label, value) {
  var pct = Math.round(value * 100);
  var cls = value >= 0.7 ? "bar-high" : value >= 0.4 ? "bar-mid" : "bar-low";

  var span = document.createElement("span");
  span.appendChild(document.createTextNode(label + " "));

  var bg = document.createElement("span");
  bg.className = "score-bar-bg";

  var fill = document.createElement("span");
  fill.className = "score-bar-fill " + cls;
  fill.style.width = pct + "%";
  bg.appendChild(fill);

  span.appendChild(bg);
  return span;
}

function createRoleCard(role) {
  var scoreClass = role.tier === "strong" ? "score-strong" : "score-good";
  var cardClass = role.tier === "strong" ? "strong" : "good";

  var card = document.createElement("div");
  card.className = "role-card " + cardClass;
  card.dataset.rank = role.rank;
  card.addEventListener("click", function () {
    toggleRole(role.rank);
  });

  // Header row
  var header = document.createElement("div");
  header.className = "role-header";

  var headerLeft = document.createElement("div");

  var rankSpan = document.createElement("span");
  rankSpan.className = "role-rank";
  rankSpan.textContent = "#" + role.rank;
  headerLeft.appendChild(rankSpan);

  var titleSpan = document.createElement("span");
  titleSpan.className = "role-title";
  titleSpan.textContent = role.title;
  headerLeft.appendChild(titleSpan);

  headerLeft.appendChild(document.createTextNode(" at "));

  var companySpan = document.createElement("span");
  companySpan.className = "role-company";
  companySpan.textContent = role.company;
  headerLeft.appendChild(companySpan);

  var scoreSpan = document.createElement("span");
  scoreSpan.className = "role-score " + scoreClass;
  scoreSpan.textContent = Math.round(role.final_score * 100) + "%";

  header.appendChild(headerLeft);
  header.appendChild(scoreSpan);
  card.appendChild(header);

  // Meta row
  var meta = document.createElement("div");
  meta.className = "role-meta";
  meta.textContent = role.location;

  if (role.salary_display) {
    var salSpan = document.createElement("span");
    salSpan.className =
      "role-salary " +
      (role.salary_source === "actual" ? "salary-actual" : "salary-estimated");
    salSpan.textContent = role.salary_display;
    meta.appendChild(salSpan);

    var salLabel = document.createElement("span");
    salLabel.style.cssText = "color:#95a5a6;font-size:11px;";
    salLabel.textContent =
      " (" + (role.salary_source === "actual" ? "actual" : "est") + ")";
    meta.appendChild(salLabel);
  }

  if (role.confidence) {
    var confSpan = document.createElement("span");
    confSpan.className = "confidence conf-" + role.confidence;
    confSpan.textContent = role.confidence;
    meta.appendChild(confSpan);
  }

  card.appendChild(meta);

  // Score bars
  var bars = document.createElement("div");
  bars.className = "score-bars";
  bars.appendChild(createScoreBar("Keyword", role.keyword_score));
  bars.appendChild(createScoreBar("Research", role.research_score));
  bars.appendChild(createScoreBar("Salary", role.salary_score));
  card.appendChild(bars);

  // Fit notes
  if (role.fit_notes) {
    var fitDiv = document.createElement("div");
    fitDiv.className = "fit-notes";
    fitDiv.textContent = role.fit_notes;
    card.appendChild(fitDiv);
  }

  // Requirement badges
  if (role.requirements) {
    var badges = document.createElement("div");
    badges.className = "req-badges";

    if (role.requirements.resume) {
      var b = document.createElement("span");
      b.className = "req-badge badge-resume";
      b.textContent = "Resume";
      badges.appendChild(b);
    }
    if (role.requirements.cover_letter) {
      var b = document.createElement("span");
      b.className = "req-badge badge-cover";
      b.textContent = "Cover Letter";
      badges.appendChild(b);
    }
    var questions = role.requirements.custom_questions || [];
    if (questions.length > 0) {
      var b = document.createElement("span");
      b.className = "req-badge badge-essay";
      b.textContent = questions.length + " Essay" + (questions.length > 1 ? "s" : "");
      badges.appendChild(b);
    }
    card.appendChild(badges);
  }

  return card;
}

function renderRoles(roles, container) {
  container.textContent = "";

  if (!roles || roles.length === 0) {
    var msg = document.createElement("div");
    msg.className = "empty";
    msg.textContent = "No roles available today.";
    container.appendChild(msg);
    return;
  }

  roles.forEach(function (role) {
    container.appendChild(createRoleCard(role));
  });
}

// --- Selection ---

function toggleRole(rank) {
  var card = document.querySelector('.role-card[data-rank="' + rank + '"]');
  if (!card) return;

  if (selectedRoles.has(rank)) {
    selectedRoles.delete(rank);
    card.classList.remove("selected");
  } else {
    selectedRoles.add(rank);
    card.classList.add("selected");
  }

  var btn = document.getElementById("apply-btn");
  var count = selectedRoles.size;
  if (count === 0) {
    btn.disabled = true;
    btn.textContent = "Select a role to apply";
  } else if (count === 1) {
    var r = rolesData.find(function (r) { return r.rank === Array.from(selectedRoles)[0]; });
    btn.disabled = false;
    btn.textContent = "Apply to " + (r ? r.company : "#" + Array.from(selectedRoles)[0]) + " \u2192";
  } else {
    btn.disabled = false;
    btn.textContent = "Apply to " + count + " roles \u2192";
  }
}

// --- Confirmation panel ---

function showConfirmPanel(roles) {
  var overlay = document.getElementById("confirm-overlay");
  var title = document.getElementById("confirm-title");
  var subtitle = document.getElementById("confirm-subtitle");
  var reqsList = document.getElementById("confirm-reqs");
  var options = document.getElementById("confirm-options");

  if (roles.length === 1) {
    title.textContent = roles[0].title + " at " + roles[0].company;
  } else {
    title.textContent = "Apply to " + roles.length + " roles";
  }

  // Show role list with tier info
  reqsList.textContent = "";
  var tierLabels = { 1: "Tier 1 — Resume only", 2: "Tier 2 — Resume + Cover Letter", 3: "Tier 3 — Full Package" };
  var hasT3 = false;

  roles.forEach(function (role) {
    var reqs = role.requirements || {};
    var tier = reqs.tier || 1;
    if (tier === 3) hasT3 = true;
    var li = document.createElement("li");
    li.textContent = role.company + " — " + role.title + " (" + (tierLabels[tier] || tierLabels[1]) + ")";
    reqsList.appendChild(li);
  });

  subtitle.textContent = roles.length === 1
    ? "Materials will be generated and emailed to you."
    : roles.length + " workflows will run in parallel. You\u2019ll get a separate email for each.";

  // Panel review option (only show if any role is Tier 3)
  options.textContent = "";
  if (hasT3) {
    var label = document.createElement("label");
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "panel-review-cb";
    cb.style.marginRight = "6px";
    label.appendChild(cb);
    label.appendChild(document.createTextNode("Run full panel review on Tier 3 roles"));
    options.appendChild(label);
  }

  overlay.classList.add("visible");
}

function hideConfirmPanel() {
  document.getElementById("confirm-overlay").classList.remove("visible");
}

// --- Submission ---

document.getElementById("apply-btn").addEventListener("click", function () {
  if (selectedRoles.size === 0) return;
  var roles = rolesData.filter(function (r) { return selectedRoles.has(r.rank); });
  if (roles.length === 0) { showStatus("No matching roles found.", "error"); return; }
  showConfirmPanel(roles);
});

document.getElementById("confirm-cancel").addEventListener("click", hideConfirmPanel);

document.getElementById("confirm-go").addEventListener("click", async function () {
  hideConfirmPanel();

  var btn = document.getElementById("apply-btn");
  btn.disabled = true;

  var roles = rolesData.filter(function (r) { return selectedRoles.has(r.rank); });
  var panelCb = document.getElementById("panel-review-cb");
  var panelReview = panelCb ? panelCb.checked : false;

  var succeeded = [];
  var failed = [];

  btn.textContent = "Dispatching 0/" + roles.length + "...";

  for (var i = 0; i < roles.length; i++) {
    var role = roles[i];
    btn.textContent = "Dispatching " + (i + 1) + "/" + roles.length + "...";

    try {
      var reqs = role.requirements || {};
      var tier = reqs.tier || 1;

      var resp = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: role.company,
          role: role.title,
          url: role.url,
          posting_text: role.description,
          location: role.location,
          tier: tier,
          panel_review: panelReview,
        }),
      });

      var result = await resp.json();
      if (resp.ok && result.ok) {
        succeeded.push(role.company);
      } else {
        failed.push(role.company + ": " + (result.error || "Unknown error"));
      }
    } catch (err) {
      failed.push(role.company + ": " + err.message);
    }
  }

  if (failed.length === 0) {
    showStatus(
      "Triggered " + succeeded.length + " workflow" + (succeeded.length > 1 ? "s" : "") +
      " (" + succeeded.join(", ") + "). You\u2019ll get an email for each.",
      "success"
    );
    btn.textContent = "Dispatched " + succeeded.length + "!";
    // Clear selection
    selectedRoles.clear();
    document.querySelectorAll(".role-card.selected").forEach(function (el) {
      el.classList.remove("selected");
    });
  } else if (succeeded.length > 0) {
    showStatus(
      "Triggered " + succeeded.length + ", failed " + failed.length + ": " + failed.join("; "),
      "error"
    );
    btn.disabled = false;
    btn.textContent = "Retry failed (" + failed.length + ")";
  } else {
    showStatus("All failed: " + failed.join("; "), "error");
    btn.disabled = false;
    btn.textContent = "Apply to " + selectedRoles.size + " roles \u2192";
  }
});

// --- Helpers ---

function showStatus(msg, type) {
  var el = document.getElementById("status");
  el.textContent = msg;
  el.className = "status " + type;
}

// --- Init ---
loadRoles();
