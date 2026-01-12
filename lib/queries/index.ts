import axios from 'axios';
import { https } from '../https';

export const MUTATIONS = {
  authSignup: async (data: {
    fname: string;
    lname: string;
    email: string;
    phone: string;
    password: string;
    deviceSignature: string;
  }) => {
    return await https.post('/auth/signup', data);
  },
  authVerify: async (data: {
    email: string;
    otp: string;
    deviceSignature: string;
  }) => {
    return await https.post('/auth/verify-account', data);
  },
  authRequestOtp: async (data: {
    email: string;
    otpType: 'LOGIN' | 'PASSWORD_RESET' | 'ACCOUNT_VERIFICATION';
  }) => {
    return await https.post('/auth/request-otp', data);
  },
  authLogin: async function (data: {
    email: string;
    password: string;
    deviceSignature: string;
  }) {
    return await https.post(`/auth/login`, data);
  },
  authPasswordReset: async function (data: {
    email: string;
    password: string;
    otp: string;
  }) {
    return await https.post(`/auth/password/reset`, data);
  },
  contactForm: async function (data: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
  }) {
    return await https.post(`/contact`, data);
  },
  subscription: async function (data: {
    name: string;
    period: string;
    noDevices: number;
    amountUsd: number;
    amountNaira: number;
  }) {
    return await https.post(`/subscription`, data);
  },
  initiateSubscription: async function (data: {
    email: string;
    planId: number;
    currency: string;
    callbackUrl: string;
  }) {
    return await https.post(`/payment/subscription/initiate`, data);
  },
};

export const QUERIES = {
  getBlogs: async (
    type?: string,
    isPublished?: boolean,
    page?: number,
    limit?: number,
    category?: string,
  ) => {
    const params = new URLSearchParams();

    if (type) params.append('type', type);
    if (isPublished) params.append('isPublished', isPublished.toString());
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (category && category !== 'all')
      params.append('categoryId', category.toString());

    const queryString = params.toString();
    const url = queryString ? `/blog?${queryString}` : '/blog';

    return await https.get(url);
  },
  getBlogById: async (id: string) => {
    const url = `/blog/${id}`;

    return await https.get(url);
  },
  getCategories: async () => {
    const url = '/category';

    return await https.get(url);
  },
  getInstructors: async () => {
    const url = '/instructor';

    return await https.get(url);
  },
  getCourses: async (page: number, limit: number) => {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/course?${queryString}` : '/course';

    return await https.get(url);
  },
  getCoursesBySearch: async (page: number, limit: number, search: string) => {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('query', search);

    const queryString = params.toString();
    const url = queryString && `/course/search?${queryString}`;

    return await https.get(url);
  },
  getCoursesByCategory: async (
    page: number,
    limit: number,
    category: string,
  ) => {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/course/category/${category}?${queryString}`
      : `/course/category/${category}`;

    return await https.get(url);
  },
  getCourseById: async (id: string) => {
    const url = `/course/${id}`;

    return await https.get(url);
  },
  getInstructorsById: async (id: string) => {
    const url = `/instructor/${id}`;

    return await https.get(url);
  },
  getUserProfile: async function () {
    return await https.get(`/user/profile`);
  },
  getToken: async function () {
    return await axios.get(`/api/auth/token`);
  },
  getBookmarkedCourses: async () => {
    const url = `/course/bookmarks`;
    return await https.get(url);
  },
  getSubscriptions: async () => {
    const url = `/subscription`;
    return await https.get(url);
  },
};
