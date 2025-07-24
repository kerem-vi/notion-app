const notionToken = "secret_..."; // Notion internal integration token
const databaseId = "xxxxx-yyyyy-zzzzz"; // Notion veritabanı ID

async function fetchNotionData() {
  const response = await fetch("https://api.notion.com/v1/databases/" + databaseId + "/query", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${notionToken}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    }
  });

  const data = await response.json();
  displayData(data.results);
}

function displayData(items) {
  const content = document.getElementById("notion-content");
  content.innerHTML = "";

  items.forEach(item => {
    const title = item.properties.Name?.title[0]?.text?.content || "Başlıksız";
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = title;
    content.appendChild(div);
  });
}

fetchNotionData();