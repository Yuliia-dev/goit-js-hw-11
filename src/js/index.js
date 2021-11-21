import ApiService from './api-service.js';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.2.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import imagesGal from '../../src/render-gal.hbs';
import '../css/styles.css';

const NewApiService = new ApiService();
let step = 0;

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBth = document.querySelector('.load-more');

galleryEl.addEventListener('click', onClickJustImage);
formEl.addEventListener('submit', searchImg);
loadMoreBth.addEventListener('click', onLoadMoreBtn);

function searchImg(e) {
  e.preventDefault();

  NewApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  NewApiService.resetPage();
  galleryEl.innerHTML = '';

  if (NewApiService.query === '') {
    step = 0;
    loadMoreBth.classList.add('is-hidden');
    galleryEl.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    return;
  }

  NewApiService.fetchImg(NewApiService.query)
    .then(showImg)
    .catch(error => {
      loadMoreBth.classList.add('is-hidden');
      galleryEl.innerHTML = '';
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again`,
      );
    });
}

function showImg(data) {
  const markup = imagesGal(data);
  galleryEl.insertAdjacentHTML('beforeend', markup);

  loadMoreBth.classList.remove('is-hidden');
  const lightbox = new SimpleLightbox('.photo-card a');
  scrollImg();

  if (data.hits.length < 40) {
    loadMoreBth.classList.add('is-hidden');
    Notiflix.Notify.info('We are sorry, but you have reached the end of search results.');
  }

  if (data.hits.length < 1) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );

    return;
  }
}

function scrollImg() {
  const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();
  if (step !== 0)
    window.scrollBy({
      top: cardHeight * 1.5,
      behavior: 'smooth',
    });
  step += 1;
}

function onClickJustImage(e) {
  e.preventDefault();
  const isImage = e.target.classList.contains('photo-card_img');
  if (!isImage) {
    return;
  }
}

function onLoadMoreBtn(e) {
  if (e) {
    NewApiService.pageAdd();
    NewApiService.fetchImg().then(showImg);
    const lightbox = new SimpleLightbox('.photo-card a');
    lightbox.refresh();
  }
}
