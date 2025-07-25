// Notion API Configuration
const notionToken = "secret_..."; // Notion internal integration token
const databaseId = "xxxxx-yyyyy-zzzzz"; // Notion veritabanı ID

// Global variables
let allData = [];
let filteredData = [];
let currentFilter = 'all';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const notionContent = document.getElementById('notion-content');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close');
const filterBtns = document.querySelectorAll('.filter-btn');

// Event Listeners
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    filterAndDisplayData();
  });
});

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Search functionality
function performSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm === '') {
    filteredData = allData;
  } else {
    filteredData = allData.filter(item => {
      const title = getPropertyValue(item, 'Name')?.toLowerCase() || '';
      const description = getPropertyValue(item, 'Description')?.toLowerCase() || '';
      const category = getPropertyValue(item, 'Category')?.toLowerCase() || '';
      
      return title.includes(searchTerm) || 
             description.includes(searchTerm) || 
             category.includes(searchTerm);
    });
  }
  filterAndDisplayData();
}

// Filter functionality
function filterAndDisplayData() {
  let dataToDisplay = filteredData;
  
  if (currentFilter !== 'all') {
    dataToDisplay = filteredData.filter(item => {
      const category = getPropertyValue(item, 'Category')?.toLowerCase() || '';
      return category === currentFilter;
    });
  }
  
  displayData(dataToDisplay);
}

// Fetch data from Notion
async function fetchNotionData() {
  try {
    showLoading();
    
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      body: JSON.stringify({
        sorts: [
          {
            property: "Created time",
            direction: "descending"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    allData = data.results;
    filteredData = allData;
    displayData(allData);
    
  } catch (error) {
    console.error('Error fetching data:', error);
    showError('Veriler yüklenirken bir hata oluştu. Lütfen Notion API ayarlarınızı kontrol edin.');
  }
}

// Display data as cards
function displayData(items) {
  notionContent.innerHTML = '';

  if (items.length === 0) {
    notionContent.innerHTML = `
      <div class="loading">
        <i class="fas fa-search"></i>
        <p>Arama sonucu bulunamadı</p>
      </div>
    `;
    return;
  }

  items.forEach((item, index) => {
    const card = createCard(item, index);
    notionContent.appendChild(card);
  });
}

// Create individual card
function createCard(item, index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${index * 0.1}s`;
  
  const title = getPropertyValue(item, 'Name') || 'Başlıksız';
  const description = getPropertyValue(item, 'Description') || 'Açıklama bulunmuyor';
  const category = getPropertyValue(item, 'Category') || 'Genel';
  const price = getPropertyValue(item, 'Price');
  const image = getPropertyValue(item, 'Image');
  const createdTime = new Date(item.created_time).toLocaleDateString('tr-TR');
  
  const icon = getCategoryIcon(category);
  
  card.innerHTML = `
    <div class="card-header">
      <div class="card-icon">
        <i class="${icon}"></i>
      </div>
      <div>
        <div class="card-title">${title}</div>
        <div class="card-category">${category}</div>
      </div>
    </div>
    
    ${image ? `<img src="${image}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin: 1rem 0;">` : ''}
    
    <div class="card-description">
      ${description.length > 100 ? description.substring(0, 100) + '...' : description}
    </div>
    
    <div class="card-footer">
      <div class="card-date">${createdTime}</div>
      ${price ? `<div class="card-price">₺${price}</div>` : ''}
      <div class="card-arrow">
        <i class="fas fa-arrow-right"></i>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => openModal(item));
  return card;
}

// Get property value from Notion item
function getPropertyValue(item, propertyName) {
  const property = item.properties[propertyName];
  if (!property) return null;
  
  switch (property.type) {
    case 'title':
      return property.title[0]?.text?.content || '';
    case 'rich_text':
      return property.rich_text[0]?.text?.content || '';
    case 'select':
      return property.select?.name || '';
    case 'number':
      return property.number?.toString() || '';
    case 'url':
      return property.url || '';
    case 'date':
      return property.date?.start || '';
    default:
      return '';
  }
}

// Get icon based on category
function getCategoryIcon(category) {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('ürün') || categoryLower.includes('product')) {
    return 'fas fa-box';
  } else if (categoryLower.includes('bilgi') || categoryLower.includes('info')) {
    return 'fas fa-info-circle';
  } else if (categoryLower.includes('proje') || categoryLower.includes('project')) {
    return 'fas fa-project-diagram';
  } else if (categoryLower.includes('not') || categoryLower.includes('note')) {
    return 'fas fa-sticky-note';
  } else {
    return 'fas fa-file-alt';
  }
}

// Modal functionality
function openModal(item) {
  const title = getPropertyValue(item, 'Name') || 'Başlıksız';
  const description = getPropertyValue(item, 'Description') || 'Açıklama bulunmuyor';
  const category = getPropertyValue(item, 'Category') || 'Genel';
  const price = getPropertyValue(item, 'Price');
  const image = getPropertyValue(item, 'Image');
  const createdTime = new Date(item.created_time).toLocaleDateString('tr-TR');
  const updatedTime = new Date(item.last_edited_time).toLocaleDateString('tr-TR');
  
  modalBody.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <h2 style="color: #333; margin-bottom: 1rem;">${title}</h2>
      <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
        <span style="background: #e9ecef; color: #6c757d; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
          ${category}
        </span>
        ${price ? `<span style="background: #d4edda; color: #155724; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
          ₺${price}
        </span>` : ''}
      </div>
    </div>
    
    ${image ? `<img src="${image}" alt="${title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 15px; margin-bottom: 2rem;">` : ''}
    
    <div style="line-height: 1.8; color: #555; margin-bottom: 2rem;">
      ${description}
    </div>
    
    <div style="border-top: 1px solid #e9ecef; padding-top: 1rem; color: #6c757d; font-size: 0.9rem;">
      <div>Oluşturulma: ${createdTime}</div>
      <div>Son güncelleme: ${updatedTime}</div>
    </div>
  `;
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Loading and error states
function showLoading() {
  notionContent.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Veriler yükleniyor...</p>
    </div>
  `;
}

function showError(message) {
  notionContent.innerHTML = `
    <div class="loading">
      <i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i>
      <p>${message}</p>
    </div>
  `;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Use demo data for testing - comment this line when using real Notion API
  loadDemoData();
  
  // Uncomment the line below when using real Notion API
  // fetchNotionData();
});

// Demo data for testing (remove this when using real Notion API)
function loadDemoData() {
  allData = [
    {
      properties: {
        Name: { title: [{ text: { content: 'Premium Ürün A' } }] },
        Description: { rich_text: [{ text: { content: 'Bu ürün hakkında detaylı açıklama ve özellikler burada yer alacak. Kullanıcılar bu ürünün tüm detaylarını görebilir.' } }] },
        Category: { select: { name: 'Ürün' } },
        Price: { number: 299.99 },
        Image: { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' }
      },
      created_time: '2024-01-15T10:00:00Z',
      last_edited_time: '2024-01-15T10:00:00Z'
    },
    {
      properties: {
        Name: { title: [{ text: { content: 'Proje Yönetimi Rehberi' } }] },
        Description: { rich_text: [{ text: { content: 'Proje yönetimi süreçleri ve metodolojiler hakkında kapsamlı bir rehber. Agile, Scrum ve diğer metodolojiler.' } }] },
        Category: { select: { name: 'Bilgi' } },
        Image: { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500' }
      },
      created_time: '2024-01-14T15:30:00Z',
      last_edited_time: '2024-01-14T15:30:00Z'
    },
    {
      properties: {
        Name: { title: [{ text: { content: 'Web Geliştirme Notları' } }] },
        Description: { rich_text: [{ text: { content: 'Modern web geliştirme teknikleri, framework\'ler ve best practice\'ler hakkında notlar.' } }] },
        Category: { select: { name: 'Bilgi' } },
        Image: { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500' }
      },
      created_time: '2024-01-13T09:15:00Z',
      last_edited_time: '2024-01-13T09:15:00Z'
    },
    {
      properties: {
        Name: { title: [{ text: { content: 'Mobil Uygulama Geliştirme' } }] },
        Description: { rich_text: [{ text: { content: 'iOS ve Android platformları için mobil uygulama geliştirme süreçleri, araçlar ve teknolojiler.' } }] },
        Category: { select: { name: 'Bilgi' } },
        Image: { url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500' }
      },
      created_time: '2024-01-12T14:20:00Z',
      last_edited_time: '2024-01-12T14:20:00Z'
    },
    {
      properties: {
        Name: { title: [{ text: { content: 'Gaming Laptop Pro' } }] },
        Description: { rich_text: [{ text: { content: 'Yüksek performanslı gaming laptop, RTX 4080 grafik kartı, 32GB RAM ve 1TB SSD ile.' } }] },
        Category: { select: { name: 'Ürün' } },
        Price: { number: 45999.99 },
        Image: { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500' }
      },
      created_time: '2024-01-11T11:45:00Z',
      last_edited_time: '2024-01-11T11:45:00Z'
    },
    {
      properties: {
        Name: { title: [{ text: { content: 'Dijital Pazarlama Stratejileri' } }] },
        Description: { rich_text: [{ text: { content: 'Sosyal medya pazarlaması, SEO, email marketing ve content marketing stratejileri.' } }] },
        Category: { select: { name: 'Bilgi' } },
        Image: { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500' }
      },
      created_time: '2024-01-10T16:30:00Z',
      last_edited_time: '2024-01-10T16:30:00Z'
    }
  ];
  
  filteredData = allData;
  displayData(allData);
}