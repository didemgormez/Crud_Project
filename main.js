//! Düzenleme Seçenekleri
let editFlag = false; //todo Düzenleme modunda olup olmadığını belirtir.
let editElement; //todo Düzenleme yapılan öğeyi temsil eder.
let editID = ""; //todo Düzenleme yapılan öğrenin benzersiz kimliği
//todo Gerekli HTML elementlerini seçme
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");



//! Fonksiyonlar

const editItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editElement = e.target.parentElement.parentElement.previousElementSibling; //* Düzenleme yapacağımız etiketi seçtik.
  grocery.value = editElement.innerText; //* Düzenlediğimiz etiketin içeriğini inputa aktardık.
  editFlag = true;
  editID = element.dataset.id; //* Düzenlenen öğenin kimliğini gönderdik.
  submitBtn.textContent = "Düzenle"; //* Düzenle butonuna tıklanıldığında Ekle butonu Düzenle olarak değişsin.
  console.log(editID);
};



//todo Ekrana bildirim bastıracak fonksiyondur.
const displayAlert = (text, action) => {
  alert.textContent = text; //todo alert classlı etiketin içerisini dışardan gönderilen parametre ile değiştirdik.
  alert.classList.add(`alert-${action}`); //todo p etiketine dinamik class ekledik



  setTimeout(() => {
    alert.textContent = ""; //todo p etiketinin içerisini boş stringe çevirdik
    alert.classList.remove(`alert-${action}`); //todo Eklediğimiz classı kaldırdık.
  }, 2000);
};


// event yerine e diyebiliriz.
const addItem = (e) => {
  e.preventDefault(); //todo Formun gönderilme olayında sayfanın yenilenmesini engeller.
  const value = grocery.value; //todo Inputun içerisine girilen değeri aldık.
  const id = new Date().getTime().toString(); //todo Benzersiz bir id oluşturduk.

  //todo Eğer inputun içerisi boş değilse ve düzenleme modunda değilse
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //todo Yeni bir "article" öğesi oluştur.
    let attr = document.createAttribute("data-id"); //todo Yeni bir veri kimliği oluştur.
    attr.value = id;
    element.setAttributeNode(attr); //todo Oluşturduğumuz idyi data özellik olarak set ettik.
    element.classList.add("grocery-item"); //todo article etiketine class ekledik



    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    //todo Oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik.
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    list.appendChild(element); //todo Oluşturduğumuz "article" etiketini htmle ekledik.
    displayAlert("Başarıyla Eklenildi", "success");
    //todo Varsayılan değerlere dönderecek fonksiyon
    setBackToDefault();
    addToLocalStorage(id, value);
  } else if (value !== "" && editFlag) {
    editElement.innerText = value; //todo Güncelleyeceğimiz elemanın içeriğini değiştirdik.
    displayAlert("Başarıyla Değiştirildi", "success");
    console.log(editID);
    editLocalStore(editID, value);
    setBackToDefault();
  }
};



//todo Varsayılan değerlere dönderir.
const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
};


//todo Silme butonuna tıklanıldığında çalışır.
const deleteItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement; //todo Sileceğimiz etikete kapsayıcıları yardımı ile ulaştık.
  const id = element.dataset.id;
  console.log(element);
  list.removeChild(element); //todo Bulduğumuz "article" etiketini list alanı içerisinden kaldırdık.
  displayAlert("Başarıyla Kaldırıldı", "danger"); //* Ekrana gönderdiğimiz parametrelere göre bildirim bastırır.

  removeFromLocalStorage(id);
};



const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  //todo Listede article etiketi var mı
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item)); //todo forEach ile dizi içerisinde bulunan her bir elemanı dönüp her bir öğeyi listeden kaldırdık.
  }

  displayAlert("Liste Boş", "danger");
  localStorage.removeItem("list");
};


// Yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};



//todo Yerel depodan öğeleri alma işlemi
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}


//todo Yerel depodan idsine göre silme işlemi
const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
};



const editLocalStore = (id, value) => {
  let items = getLocalStorage();

  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};



//todo Gönderilen id ve value(değer) sahip bir öğe oluşturan fonksiyon
const createListItem = (id, value) => {
  const element = document.createElement("article"); //todo Yeni bir "article" öğesi oluştur.
  let attr = document.createAttribute("data-id"); //todo Yeni bir veri kimliği oluştur.
  attr.value = id;
  element.setAttributeNode(attr); //todo Oluşturduğumuz idyi data özellik olarak set ettik.
  element.classList.add("grocery-item"); //todo article etiketine class ekledik

  element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
  //todo Oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik.
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  list.appendChild(element); //todo Oluşturduğumuz "article" etiketini htmle ekledik.
};



const setupItems = () => {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
  }
};



//! Olay İzleyicileri

//todo Form gönderildiğinde addItem fonksiyonu çalışır.
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);