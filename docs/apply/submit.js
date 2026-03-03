/**
 * GitHub Pages selection form for the daily "Pick One and Apply" pipeline.
 *
 * Loads data.json, renders role cards using safe DOM construction,
 * and dispatches a repository_dispatch event to trigger tailoring.
 */

const REPO_OWNER = "jarlathphelan";
const REPO_NAME = "job-search";
const DATA_FILE = "data.json";

let selectedRole = null;
let rolesData = [];

// --- Data loading ---

async function loadRoles() {
  const container = document.getElementById("roles-container");
  try {
    const resp = await fetch(DATA_FILE);
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    rolesData = data.roles || [];
    renderRoles(rolesData, container);
  } catch (_err) {
    container.textContent = "";
    const msg = document.createElement("div");
    msg.className = "empty";
    msg.textContent = "No roles available today. Check back at 6 PM ET.";
    container.appendChild(msg);
  }
}

// --- Rendering (safe DOM construction) ---

function createScoreBar(label, value) {
  const pct = Math.round(value * 100);
  const cls = value >= 0.7 ? "bar-high" : value >= 0.4 ? "bar-mid" : "bar-low";

  const span = document.createElement("span");

  const labelText = document.createTextNode(label + " ");
  span.appendChild(labelText);

  const bg = document.createElement("span");
  bg.className = "score-bar-bg";

  const fill = document.createElement("span");
  fill.className = "score-bar-fill " + cls;
  fill.style.width = pct + "%";
  bg.appendChild(fill);

  span.appendChild(bg);
  return span;
}

function createRoleCard(role) {
  const scoreClass = role.tier === "strong" ? "score-strong" : "score-good";
  const cardClass = role.tier === "strong" ? "strong" : "good";

  const card = document.createElement("div");
  card.className = "role-card " + cardClass;
  card.dataset.rank = role.rank;
  card.addEventListener("click", function () {
    selectRole(role.rank);
  });

  // Header row
  const header = document.createElement("div");
  header.className = "role-header";

  const headerLeft = document.createElement("div");

  const rankSpan = document.createElement("span");
  rankSpan.className = "role-rank";
  rankSpan.textContent = "#" + role.rank;
  headerLeft.appendChild(rankSpan);

  const titleSpan = document.createElement("span");
  titleSpan.className = "role-title";
  titleSpan.textContent = role.title;
  headerLeft.appendChild(titleSpan);

  headerLeft.appendChild(document.createTextNode(" at "));

  const companySpan = document.createElement("span");
  companySpan.className = "role-company";
  companySpan.textContent = role.company;
  headerLeft.appendChild(companySpan);

  const scoreSpan = document.createElement("span");
  scoreSpan.className = "role-score " + scoreClass;
  scoreSpan.textContent = Math.round(role.final_score * 100) + "%";

  header.appendChild(headerLeft);
  header.appendChild(scoreSpan);
  card.appendChild(header);

  // Meta row
  const meta = document.createElement("div");
  meta.className = "role-meta";
  meta.textContent = role.location;

  if (role.salary_display) {
    const salSpan = document.createElement("span");
    salSpan.className =
      "role-salary " +
      (role.salary_source === "actual" ? "salary-actual" : "salary-estimated");
    salSpan.textContent = role.salary_display;
    meta.appendChild(salSpan);

    const salLabel = document.createElement("span");
    salLabel.style.cssText = "color:#95a5a6;font-size:11px;";
    salLabel.textContent =
      "(" + (role.salary_source === "actual" ? "actual" : "est") + ")";
    meta.appendChild(salLabel);
  }

  if (role.confidence) {
    const confSpan = document.createElement("span");
    confSpan.className = "confidence conf-" + role.confidence;
    confSpan.textContent = role.confidence;
    meta.appendChild(confSpan);
  }

  card.appendChild(meta);

  // Score bars
  const bars = document.createElement("div");
  bars.className = "score-bars";
  bars.appendChild(createScoreBar("Keyword", role.keyword_score));
  bars.appendChild(createScoreBar("Research", role.research_score));
  bars.appendChild(createScoreBar("Salary", role.salary_score));
  card.appendChild(bars);

  // Fit notes
  if (role.fit_notes) {
    const fitDiv = document.createElement("div");
    fitDiv.className = "fit-notes";
    fitDiv.textContent = role.fit_notes;
    card.appendChild(fitDiv);
  }

  return card;
}

function renderRoles(roles, container) {
  container.textContent = "";

  if (!roles || roles.length === 0) {
    const msg = document.createElement("div");
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

function selectRole(rank) {
  document.querySelectorAll(".role-card.selected").forEach(function (el) {
    el.classList.remove("selected");
  });

  var card = document.querySelector('.role-card[data-rank="' + rank + '"]');
  if (card) {
    card.classList.add("selected");
    selectedRole = rank;
    var btn = document.getElementById("apply-btn");
    btn.disabled = false;
    btn.textContent = "Apply to #" + rank + " \u2192";
  }
}

// --- Submission ---

document.getElementById("apply-btn").addEventListener("click", async function () {
  if (!selectedRole) return;

  var token = document.getElementById("gh-token").value.trim();
  if (!token) {
    showStatus("Enter your GitHub token first.", "error");
    return;
  }

  var btn = document.getElementById("apply-btn");
  btn.disabled = true;
  btn.textContent = "Dispatching...";

  try {
    var role = rolesData.find(function (r) {
      return r.rank === selectedRole;
    });

    if (!role) {
      showStatus("Role not found in data.", "error");
      return;
    }

    var dispatchResp = await fetch(
      "https://api.github.com/repos/" + REPO_OWNER + "/" + REPO_NAME + "/dispatches",
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: "Bearer " + token,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          event_type: "tailor_application",
          client_payload: {
            company: role.company,
            role: role.title,
            url: role.url,
            posting_text: role.description,
            location: role.location,
          },
        }),
      }
    );

    if (dispatchResp.status === 204) {
      showStatus(
        "Tailoring triggered for " +
          role.title +
          " at " +
          role.company +
          ". You'll get an email when materials are ready.",
        "success"
      );
      btn.textContent = "Dispatched!";
    } else {
      var errText = await dispatchResp.text();
      showStatus("GitHub API error: " + dispatchResp.status + " " + errText, "error");
      btn.disabled = false;
      btn.textContent = "Apply to #" + selectedRole + " \u2192";
    }
  } catch (err) {
    showStatus("Error: " + err.message, "error");
    btn.disabled = false;
    btn.textContent = "Apply to #" + selectedRole + " \u2192";
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
