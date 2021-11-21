import axios from 'axios';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.2.min.css';
const API_KEY = '24403288-52e492b65d436c39cf47d1c3c';
// axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class ApiService {
  constructor() {
    this.pageNum = 1;
    this.searchValue = '';
    this.URL = 'https://pixabay.com/api/';
  }

  fetchImg() {
    return axios
      .get(
        `${this.URL}?key=${API_KEY}&q=${this.searchValue}&page=${this.pageNum}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`,
      )
      .then(response => {
        if (this.pageNum === 1 && response.data.totalHits > 1) {
          Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        }

        return response.data;
      });
  }

  pageAdd() {
    this.pageNum += 1;
  }

  resetPage() {
    this.pageNum = 1;
  }

  get query() {
    return this.searchValue;
  }

  set query(newValue) {
    this.searchValue = newValue;
  }
}
