// Inisialisasi elemen-elemen DOM yang dibutuhkan
const cards = document.querySelectorAll(".card"),
  timeTag = document.querySelector(".time b"),
  flipsTag = document.querySelector(".flips b"),
  refreshBtn = document.querySelector(".details button");

// Inisialisasi variabel-variabel permainan
let maxTime = 60;
let timeLeft = maxTime;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;

// Fungsi untuk menginisialisasi timer
function initTimer() {
  if (timeLeft <= 0) {
    clearInterval(timer);
    if (matchedCard < 6) {
      setTimeout(() => {

        // Logika alert ketika waktu habis
        alert("Waktu Habis");
      }, 500);
    }
    return;
  }
  timeLeft--;
  timeTag.innerText = timeLeft;
}

// Fungsi untuk membalik kartu
function flipCard({ target: clickedCard }) {
  if (!isPlaying) {
    isPlaying = true;
    timer = setInterval(initTimer, 1000);
  }
  if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
    flips++;
    flipsTag.innerText = flips;
    clickedCard.classList.add("flip");
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src,
      cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
  }
}

// Fungsi untuk membandingkan dua kartu yang dibalik
function matchCards(img1, img2) {
  if (img1 === img2) {
    matchedCard++;
    if (matchedCard === 6 && timeLeft > 0) {
      clearInterval(timer);
      setTimeout(() => {
      // Logika alert ketika user menang
        alert("Selamat, Anda Telah Menang!");
      }, 500);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    disableDeck = false;
    return;
  }

  // Animasi shake pada kartu yang tidak cocok
  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  // Mengembalikan kartu ke posisi semula setelah animasi shake
  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

// Fungsi untuk mengacak urutan kartu
function shuffleCard() {
  timeLeft = maxTime;
  flips = matchedCard = 0;
  cardOne = cardTwo = "";
  clearInterval(timer);
  timeTag.innerText = timeLeft;
  flipsTag.innerText = flips;
  disableDeck = isPlaying = false;

  // Array untuk menyimpan urutan kartu yang diacak
  let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  // Mengatur ulang kartu-kartu
  cards.forEach((card, index) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    setTimeout(() => {
      imgTag.src = `images/img-${arr[index]}.png`;
    }, 500);
    card.addEventListener("click", flipCard);
  });
}

// Memanggil fungsi shuffleCard untuk inisialisasi permainan
shuffleCard();

// Menambahkan event listener untuk tombol Refresh
refreshBtn.addEventListener("click", shuffleCard);

// Menambahkan event listener untuk setiap kartu
cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});
