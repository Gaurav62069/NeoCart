import axios from 'axios';
import NProgress from 'nprogress';

// NProgress को कॉन्फ़िगर करें (Spinner हटा दें)
NProgress.configure({ showSpinner: false });

// जब भी कोई रिक्वेस्ट (API call) शुरू होती है
axios.interceptors.request.use(
  (config) => {
    NProgress.start(); // लोडिंग बार शुरू करें
    return config;
  },
  (error) => {
    NProgress.done(); // एरर आने पर बंद करें
    return Promise.reject(error);
  }
);

// जब भी कोई रिस्पांस (API call का जवाब) आता है
axios.interceptors.response.use(
  (response) => {
    NProgress.done(); // रिस्पांस मिलने पर बंद करें
    return response;
  },
  (error) => {
    NProgress.done(); // एरर आने पर बंद करें
    return Promise.reject(error);
  }
);

export default axios;