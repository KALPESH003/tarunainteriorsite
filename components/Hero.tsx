'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Roboto_Condensed } from 'next/font/google';
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import ContactModal from './Contactmodal';

/* ------------------------------------------------------------------ */
/*  Font (remove if Roboto Condensed is already loaded globally)       */
/* ------------------------------------------------------------------ */
const roboto = Roboto_Condensed({ subsets: ['latin'], display: 'swap' });
const font = roboto.className;

/* ------------------------------------------------------------------ */
/*  Content — edit everything here                                     */
/* ------------------------------------------------------------------ */
const HEADLINE = 'Timeless Living.';
const LOCATION = 'Vadodara, India';
const ORANGE = '#FF5C05';

const NAV = [
  { label: 'Projects', href: '#projects' },
  { label: 'About us', href: '#about' },
  { label: 'Services', href: '#services' },
];

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1756706718604-ef4af3970e33?q=80&w=1974&auto=format&fit=crop',
    title: 'The Atharva Project',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1465804575741-338df8554e02?q=80&w=2073&auto=format&fit=crop',
    title: 'Lumina Penthouse',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    title: 'Vanguard Workspace',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1496564203457-11bb12075d90?q=80&w=1900&auto=format&fit=crop',
    title: 'Oak & Iron Villa',
  },
];

const PARTNERS = [
  { id: 'p2', name: 'Nexa', src: '/ClientCarousel/Amar cars.png' },
  { id: 'p3', name: 'Skechers', src: '/ClientCarousel/CORP_SKX_S_SHIFTED_1COLOR-logo.png' },
  { id: 'p5', name: 'SHAILY', src: '/ClientCarousel/shaily-logos-02.png' },
  { id: 'p12', name: 'HIMALAYA', src: '/ClientCarousel/Himalaya.png' },
  { id: 'p6', name: 'Alembic', src: '/ClientCarousel/veda-2.png' },
  { id: 'p7', name: 'GXP', src: '/ClientCarousel/web-logo-GXP.png' },
  { id: 'p8', name: 'Ronak Group', src: '/ClientCarousel/RonakGroup.png' },
  { id: 'p9', name: 'Jayant Agro-Organics LTD.', src: '/ClientCarousel/logo-new.png' },
  { id: 'p10', name: 'Parth Electricals & Engineering Limited', src: '/ClientCarousel/Parth Electricals & Engineering Limited.png' },
  { id: 'p11', name: 'Shree Jagdamba Jewllers', src: '/ClientCarousel/Group 66.png' },
  { id: 'p13', name: 'Aarya Bliss', src: '/ClientCarousel/aarya bliss.png' },
  { id: 'p14', name: 'Zillion Group', src: '/ClientCarousel/zillion.png' },
  { id: 'p15', name: 'Maruti Heights', src: '/ClientCarousel/marutiheights.png' },
  { id: 'p16', name: 'Aiden Web Solution', src: '/ClientCarousel/aiden.png' },
];

/* ------------------------------------------------------------------ */
/*  Timing                                                             */
/* ------------------------------------------------------------------ */
const LOAD_MS = 3800; // total loading time (also drives the white text fill)
const FRAMES = 8; // number of image shutters inside the logo
const SLATS = 6; // slats per shutter
const SLIDE_MS = 6500; // hero slideshow interval

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IO: [number, number, number, number] = [0.76, 0, 0.24, 1];

/* Smaller copies of the slides for the logo mask (logo is only ~400px wide) */
const LOADER_IMAGES = SLIDES.map((s) => s.image.replace('w=1600', 'w=900'));

/* ------------------------------------------------------------------ */
/*  Logo geometry (viewBox 0 0 143 67)                                 */
/* ------------------------------------------------------------------ */
const P_THE =
  'M4.30078 1.46875V10H2.29102V1.46875H4.30078ZM6.36914 1.46875V3.05664H0.28125V1.46875H6.36914ZM11.441 4.85547V6.4375H7.98398V4.85547H11.441ZM8.64023 1.46875V10H6.63633V1.46875H8.64023ZM12.7945 1.46875V10H10.7906V1.46875H12.7945ZM18.3879 8.41797V10H14.6555V8.41797H18.3879ZM15.3527 1.46875V10H13.3488V1.46875H15.3527ZM17.9016 4.85547V6.38477H14.6555V4.85547H17.9016ZM18.4055 1.46875V3.05664H14.6555V1.46875H18.4055Z';

const P_TARUNA =
  'M12.9023 13.4062V39H6.87305V13.4062H12.9023ZM19.1074 13.4062V18.1699H0.84375V13.4062H19.1074ZM27.5027 18.7852L22.7391 39H16.2703L24.1629 13.4062H28.2059L27.5027 18.7852ZM31.2293 39L26.4656 18.7852L25.6746 13.4062H29.7879L37.698 39H31.2293ZM31.4227 29.4551V34.2188H20.3309V29.4551H31.4227ZM37.8492 13.4062H46.6031C48.3141 13.4062 49.7965 13.6992 51.0504 14.2852C52.3043 14.8711 53.2652 15.7383 53.9332 16.8867C54.6129 18.0352 54.9527 19.4531 54.9527 21.1406C54.9527 22.6055 54.7652 23.8301 54.3902 24.8145C54.027 25.7988 53.5113 26.6133 52.8434 27.2578C52.1754 27.8906 51.3902 28.4121 50.4879 28.8223L48.5367 29.9648H41.6637L41.6285 25.2012H46.4625C47.0133 25.2012 47.4703 25.0605 47.8336 24.7793C48.1969 24.498 48.4664 24.0996 48.6422 23.584C48.8297 23.0566 48.9234 22.4297 48.9234 21.7031C48.9234 20.9648 48.8355 20.332 48.6598 19.8047C48.484 19.2773 48.2262 18.873 47.8863 18.5918C47.5582 18.3105 47.1305 18.1699 46.6031 18.1699H43.8609V39H37.8492V13.4062ZM49.1871 39L44.652 27.6797L51.0152 27.6445L55.6383 38.7363V39H49.1871ZM67.7426 13.4062H73.7719V30.8262C73.7719 32.8184 73.4145 34.4473 72.6996 35.7129C71.9848 36.9668 70.9828 37.8867 69.6937 38.4727C68.4047 39.0586 66.8812 39.3516 65.1234 39.3516C63.3773 39.3516 61.8539 39.0586 60.5531 38.4727C59.2523 37.8867 58.2328 36.9668 57.4945 35.7129C56.768 34.4473 56.4047 32.8184 56.4047 30.8262V13.4062H62.4516V30.8262C62.4516 31.8809 62.5453 32.6836 62.7328 33.2344C62.932 33.7734 63.2309 34.1367 63.6293 34.3242C64.0277 34.5117 64.5258 34.6055 65.1234 34.6055C65.7328 34.6055 66.2309 34.5117 66.6176 34.3242C67.0043 34.1367 67.2855 33.7734 67.4613 33.2344C67.6488 32.6836 67.7426 31.8809 67.7426 30.8262V13.4062ZM93.8918 13.4062V39H87.8977L81.4816 23.0742V39H75.4699V13.4062H81.4816L87.8977 29.332V13.4062H93.8918ZM105.557 18.7852L100.793 39H94.3242L102.217 13.4062H106.26L105.557 18.7852ZM109.283 39L104.52 18.7852L103.729 13.4062H107.842L115.752 39H109.283ZM109.477 29.4551V34.2188H98.3848V29.4551H109.477Z';

const P_INTERIOR =
  'M2.67773 42.4688V51H0.679688V42.4688H2.67773ZM9.48398 42.4688V51H7.48594L5.34727 45.6914V51H3.34336V42.4688H5.34727L7.48594 47.7773V42.4688H9.48398ZM13.6008 42.4688V51H11.591V42.4688H13.6008ZM15.6691 42.4688V44.0566H9.58125V42.4688H15.6691ZM20.9754 49.418V51H17.243V49.418H20.9754ZM17.9402 42.4688V51H15.9363V42.4688H17.9402ZM20.4891 45.8555V47.3848H17.243V45.8555H20.4891ZM20.993 42.4688V44.0566H17.243V42.4688H20.993ZM21.2016 42.4688H24.1195C24.6898 42.4688 25.184 42.5664 25.602 42.7617C26.0199 42.957 26.3402 43.2461 26.5629 43.6289C26.7895 44.0117 26.9027 44.4844 26.9027 45.0469C26.9027 45.5352 26.8402 45.9434 26.7152 46.2715C26.5941 46.5996 26.4223 46.8711 26.1996 47.0859C25.977 47.2969 25.7152 47.4707 25.4145 47.6074L24.7641 47.9883H22.473L22.4613 46.4004H24.0727C24.2563 46.4004 24.4086 46.3535 24.5297 46.2598C24.6508 46.166 24.7406 46.0332 24.7992 45.8613C24.8617 45.6855 24.893 45.4766 24.893 45.2344C24.893 44.9883 24.8637 44.7773 24.8051 44.6016C24.7465 44.4258 24.6605 44.291 24.5473 44.1973C24.4379 44.1035 24.2953 44.0566 24.1195 44.0566H23.2055V51H21.2016V42.4688ZM24.9809 51L23.4691 47.2266L25.5902 47.2148L27.1313 50.9121V51H24.9809ZM29.502 42.4688V51H27.5039V42.4688H29.502ZM36.3668 46.0957V47.3848C36.3668 47.998 36.2906 48.5371 36.1383 49.002C35.9859 49.4668 35.7691 49.8574 35.4879 50.1738C35.2066 50.4863 34.8727 50.7227 34.4859 50.8828C34.1031 51.0391 33.6773 51.1172 33.2086 51.1172C32.7359 51.1172 32.3062 51.0391 31.9195 50.8828C31.5328 50.7227 31.1988 50.4863 30.9176 50.1738C30.6363 49.8574 30.4195 49.4668 30.2672 49.002C30.1148 48.5371 30.0387 47.998 30.0387 47.3848V46.0957C30.0387 45.4824 30.1148 44.9414 30.2672 44.4727C30.4195 44.0039 30.6344 43.6133 30.9117 43.3008C31.193 42.9883 31.527 42.752 31.9137 42.5918C32.3004 42.4316 32.7301 42.3516 33.2027 42.3516C33.6715 42.3516 34.0992 42.4316 34.4859 42.5918C34.8766 42.752 35.2105 42.9883 35.4879 43.3008C35.7652 43.6133 35.9801 44.0039 36.1324 44.4727C36.2887 44.9414 36.3668 45.4824 36.3668 46.0957ZM34.3336 47.3848V46.084C34.3336 45.7012 34.3102 45.375 34.2633 45.1055C34.2164 44.8359 34.1461 44.6172 34.0523 44.4492C33.9586 44.2812 33.8414 44.1582 33.7008 44.0801C33.5602 44.002 33.3941 43.9629 33.2027 43.9629C33.0035 43.9629 32.8336 44.002 32.693 44.0801C32.5523 44.1582 32.4352 44.2812 32.3414 44.4492C32.2516 44.6172 32.1852 44.8359 32.1422 45.1055C32.0992 45.375 32.0777 45.7012 32.0777 46.084V47.3848C32.0777 47.7637 32.0992 48.0879 32.1422 48.3574C32.1852 48.623 32.2516 48.8418 32.3414 49.0137C32.4352 49.1855 32.5543 49.3125 32.6988 49.3945C32.8434 49.4727 33.0133 49.5117 33.2086 49.5117C33.3961 49.5117 33.5602 49.4727 33.7008 49.3945C33.8453 49.3125 33.9625 49.1855 34.0523 49.0137C34.1461 48.8418 34.2164 48.623 34.2633 48.3574C34.3102 48.0879 34.3336 47.7637 34.3336 47.3848ZM36.8156 42.4688H39.7336C40.3039 42.4688 40.798 42.5664 41.216 42.7617C41.634 42.957 41.9543 43.2461 42.177 43.6289C42.4035 44.0117 42.5168 44.4844 42.5168 45.0469C42.5168 45.5352 42.4543 45.9434 42.3293 46.2715C42.2082 46.5996 42.0363 46.8711 41.8137 47.0859C41.591 47.2969 41.3293 47.4707 41.0285 47.6074L40.3781 47.9883H38.0871L38.0754 46.4004H39.6867C39.8703 46.4004 40.0227 46.3535 40.1437 46.2598C40.2648 46.166 40.3547 46.0332 40.4133 45.8613C40.4758 45.6855 40.507 45.4766 40.507 45.2344C40.507 44.9883 40.4777 44.7773 40.4191 44.6016C40.3605 44.4258 40.2746 44.291 40.1613 44.1973C40.052 44.1035 39.9094 44.0566 39.7336 44.0566H38.8195V51H36.8156V42.4688ZM40.5949 51L39.0832 47.2266L41.2043 47.2148L42.7453 50.9121V51H40.5949ZM46.5984 48.7324C46.5984 48.5996 46.5848 48.4805 46.5574 48.375C46.534 48.2656 46.4852 48.1641 46.4109 48.0703C46.3406 47.9766 46.2332 47.8828 46.0887 47.7891C45.9441 47.6914 45.7508 47.5898 45.5086 47.4844C45.2039 47.3594 44.9051 47.2188 44.6121 47.0625C44.3191 46.9023 44.0555 46.7168 43.8211 46.5059C43.5906 46.291 43.4051 46.041 43.2645 45.7559C43.1238 45.4668 43.0535 45.1309 43.0535 44.748C43.0535 44.3809 43.1238 44.0508 43.2645 43.7578C43.409 43.4609 43.6063 43.209 43.8563 43.002C44.1102 42.791 44.409 42.6309 44.7527 42.5215C45.0965 42.4082 45.4715 42.3516 45.8777 42.3516C46.4168 42.3516 46.8914 42.4609 47.3016 42.6797C47.7156 42.8945 48.0379 43.2012 48.2684 43.5996C48.5027 43.9941 48.6199 44.4609 48.6199 45H46.6219C46.6219 44.7852 46.5945 44.5957 46.5398 44.4316C46.4852 44.2676 46.3992 44.1387 46.282 44.0449C46.1688 43.9512 46.0184 43.9043 45.8309 43.9043C45.6629 43.9043 45.5203 43.9434 45.4031 44.0215C45.2898 44.0996 45.2039 44.2051 45.1453 44.3379C45.0867 44.4668 45.0574 44.6094 45.0574 44.7656C45.0574 44.8945 45.0867 45.0117 45.1453 45.1172C45.2039 45.2188 45.284 45.3145 45.3855 45.4043C45.491 45.4941 45.6121 45.5801 45.7488 45.6621C45.8895 45.7441 46.0398 45.8242 46.2 45.9023C46.5867 46.0469 46.9285 46.209 47.2254 46.3887C47.5262 46.5645 47.7781 46.7656 47.9813 46.9922C48.1844 47.2148 48.3367 47.4688 48.4383 47.7539C48.5438 48.0391 48.5965 48.3613 48.5965 48.7207C48.5965 49.1035 48.534 49.4434 48.409 49.7402C48.2879 50.0371 48.1102 50.2891 47.8758 50.4961C47.6414 50.6992 47.3582 50.8535 47.0262 50.959C46.698 51.0645 46.327 51.1172 45.9129 51.1172C45.534 51.1172 45.1609 51.0625 44.7938 50.9531C44.4305 50.8398 44.1004 50.668 43.8035 50.4375C43.5105 50.2031 43.2762 49.9043 43.1004 49.541C42.9246 49.1738 42.8367 48.7383 42.8367 48.2344H44.8523C44.8523 48.4844 44.8719 48.6953 44.9109 48.8672C44.95 49.0391 45.0105 49.1777 45.0926 49.2832C45.1785 49.3848 45.2879 49.459 45.4207 49.5059C45.5535 49.5488 45.7176 49.5703 45.9129 49.5703C46.0926 49.5703 46.2313 49.5332 46.3289 49.459C46.4305 49.3809 46.5008 49.2793 46.5398 49.1543C46.5789 49.0254 46.5984 48.8848 46.5984 48.7324ZM57.2109 46.4414V50.0039C57.0781 50.1328 56.8828 50.2852 56.625 50.4609C56.3672 50.6367 56.043 50.791 55.6523 50.9238C55.2656 51.0527 54.8086 51.1172 54.2812 51.1172C53.793 51.1172 53.3535 51.043 52.9629 50.8945C52.5723 50.7461 52.2383 50.5215 51.9609 50.2207C51.6875 49.916 51.4766 49.5352 51.3281 49.0781C51.1797 48.6172 51.1055 48.0723 51.1055 47.4434V46.0312C51.1055 45.4062 51.1797 44.8613 51.3281 44.3965C51.4805 43.9316 51.6934 43.5488 51.9668 43.248C52.2402 42.9473 52.5645 42.7227 52.9395 42.5742C53.3145 42.4219 53.7305 42.3457 54.1875 42.3457C54.8711 42.3457 55.4316 42.4609 55.8691 42.6914C56.3105 42.9219 56.6406 43.2539 56.8594 43.6875C57.0781 44.1172 57.1934 44.6387 57.2051 45.252H55.2832C55.2676 44.9277 55.2207 44.668 55.1426 44.4727C55.0645 44.2773 54.9531 44.1387 54.8086 44.0566C54.6641 43.9707 54.4805 43.9277 54.2578 43.9277C54.0781 43.9277 53.918 43.9629 53.7773 44.0332C53.6406 44.1035 53.5234 44.2207 53.4258 44.3848C53.332 44.5449 53.2598 44.7598 53.209 45.0293C53.1621 45.2988 53.1387 45.6289 53.1387 46.0195V47.4434C53.1387 47.8301 53.1621 48.1582 53.209 48.4277C53.2559 48.6973 53.3281 48.9121 53.4258 49.0723C53.5234 49.2324 53.6543 49.3496 53.8184 49.4238C53.9824 49.498 54.1855 49.5352 54.4277 49.5352C54.5762 49.5352 54.6992 49.5156 54.7969 49.4766C54.8945 49.4375 54.9766 49.3926 55.043 49.3418C55.1094 49.291 55.1641 49.2559 55.207 49.2363V47.8535H54.1875V46.4414H57.2109ZM60.9176 44.2617L59.3297 51H57.1734L59.8043 42.4688H61.152L60.9176 44.2617ZM62.1598 51L60.5719 44.2617L60.3082 42.4688H61.6793L64.316 51H62.1598ZM62.2242 47.8184V49.4062H58.527V47.8184H62.2242ZM69.2473 49.418V51H65.6613V49.418H69.2473ZM66.3645 42.4688V51H64.3605V42.4688H66.3645ZM74.4012 49.418V51H70.8152V49.418H74.4012ZM71.5184 42.4688V51H69.5145V42.4688H71.5184ZM79.7074 49.418V51H75.975V49.418H79.7074ZM76.6723 42.4688V51H74.6684V42.4688H76.6723ZM79.2211 45.8555V47.3848H75.975V45.8555H79.2211ZM79.725 42.4688V44.0566H75.975V42.4688H79.725ZM79.9336 42.4688H82.8516C83.4219 42.4688 83.916 42.5664 84.334 42.7617C84.752 42.957 85.0723 43.2461 85.2949 43.6289C85.5215 44.0117 85.6348 44.4844 85.6348 45.0469C85.6348 45.5352 85.5723 45.9434 85.4473 46.2715C85.3262 46.5996 85.1543 46.8711 84.9316 47.0859C84.709 47.2969 84.4473 47.4707 84.1465 47.6074L83.4961 47.9883H81.2051L81.1934 46.4004H82.8047C82.9883 46.4004 83.1406 46.3535 83.2617 46.2598C83.3828 46.166 83.4727 46.0332 83.5312 45.8613C83.5938 45.6855 83.625 45.4766 83.625 45.2344C83.625 44.9883 83.5957 44.7773 83.5371 44.6016C83.4785 44.4258 83.3926 44.291 83.2793 44.1973C83.1699 44.1035 83.0273 44.0566 82.8516 44.0566H81.9375V51H79.9336V42.4688ZM83.7129 51L82.2012 47.2266L84.3223 47.2148L85.8633 50.9121V51H83.7129ZM87.4898 42.4688L88.5855 46.1719L89.6871 42.4688H91.8375L89.6109 47.9355V51H87.5719V47.9355L85.3395 42.4688H87.4898Z';

const P_DOT = 'M92.102 51.008V49.544H93.566V51.008H92.102Z';
const P_OUTLINE = 'M20.2553 10L115 10.0002C117.209 10.0002 119 11.7911 119 14.0002V50C119 52.2091 117.209 54 115 54H0';

/* The three lettering paths as a CSS mask (images show through the letters) */
const LOGO_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 143 67"><path d="${P_THE}"/><path d="${P_TARUNA}"/><path d="${P_INTERIOR}"/></svg>`
)}")`;

const maskStyle = {
  WebkitMaskImage: LOGO_MASK,
  maskImage: LOGO_MASK,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
} as const;

/* ------------------------------------------------------------------ */
/*  Styles for the marquee + scroll cue                                */
/* ------------------------------------------------------------------ */
const CSS = `
@keyframes tz-pan { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes tz-nudge { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
.tz-pan { animation: tz-pan 60s linear infinite; width: max-content; }
.tz-pan:hover { animation-play-state: paused; }
.tz-fade {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 3%, #000 97%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 3%, #000 97%, transparent);
}
.tz-nudge { animation: tz-nudge 1.8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .tz-pan, .tz-nudge { animation: none; } }
`;

type Phase = 'loading' | 'resolve' | 'landing' | 'done';

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/*  Shutter: one image revealed by alternating slats (venetian blind)  */
/* ------------------------------------------------------------------ */
function ShutterLayer({ src }: { src: string }) {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: SLATS }).map((_, i) => {
        const fromTop = i % 2 === 0;
        return (
          <motion.div
            key={i}
            className="absolute top-0 h-full overflow-hidden"
            style={{ left: `${(i / SLATS) * 100}%`, width: `${100 / SLATS}%` }}
            initial={{ clipPath: fromTop ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 0.32, delay: i * 0.02, ease: EASE_IO }}
          >
            <div
              className="absolute top-0 h-full bg-cover bg-center"
              style={{
                width: `${SLATS * 100}%`,
                left: `${-i * 100}%`,
                backgroundImage: `url(${src})`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Logo vector layer (solid white lettering + orange dot + outline)   */
/* ------------------------------------------------------------------ */
function LogoSvg({
  intro = false,
  solid = true,
  heavy = false,
}: {
  intro?: boolean; // draw the outline in
  solid?: boolean; // show solid white lettering
  heavy?: boolean; // final (navbar) stroke weight
}) {
  return (
    <svg
      viewBox="0 0 143 67"
      fill="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full overflow-visible"
    >
      <motion.g
        fill="#fff"
        initial={false}
        animate={{ opacity: solid ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <path d={P_THE} />
        <path d={P_TARUNA} />
        <path d={P_INTERIOR} />
      </motion.g>
      <motion.path
        d={P_DOT}
        fill={ORANGE}
        initial={intro ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      />
      <motion.path
        d={P_OUTLINE}
        stroke="#fff"
        initial={intro ? { pathLength: 0 } : false}
        animate={{ pathLength: 1, strokeWidth: heavy ? 1.6 : 0.8 }}
        transition={{
          pathLength: { duration: 1.3, delay: 0.1, ease: EASE_IO },
          strokeWidth: { duration: 1.4, ease: EASE_IO },
        }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>('loading');
  const [frame, setFrame] = useState(0);
  const [current, setCurrent] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const progress = useMotionValue(0);
  const fillClip = useTransform(progress, (v) => `inset(0 ${100 - v}% 0 0)`);

  const controls = useAnimationControls();
  const flyRef = useRef<HTMLDivElement>(null);
  const navLogoRef = useRef<HTMLAnchorElement>(null);
  const heroLoaded = useRef(false);
  const frameRef = useRef(0);

  const landed = phase === 'landing' || phase === 'done';
  const ready = phase === 'done';

  /* 1 — Loading: drives the text fill + shutter frames, then hands off */
  useEffect(() => {
    if (reduce) {
      setPhase('done');
      return;
    }

    let raf = 0;
    let cancelled = false;
    let finished = false;
    let assets = false;
    const startAt = performance.now();
    frameRef.current = 0;
    setFrame(0);

    Promise.all(
      LOADER_IMAGES.map(
        (u) =>
          new Promise<void>((res) => {
            const img = new window.Image();
            img.onload = img.onerror = () => res();
            img.src = u;
          })
      )
    ).then(() => {
      assets = true;
    });

    const finish = async () => {
      progress.set(100);
      await wait(450);
      if (cancelled) return;
      setPhase('resolve'); // images dissolve into solid white lettering
      await wait(800);
      if (cancelled) return;
      setPhase('landing'); // logo flies to the navbar
    };

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startAt;
      const t = Math.min(elapsed / LOAD_MS, 1);
      const ok = (assets && heroLoaded.current) || elapsed > LOAD_MS + 2500; // failsafe
      const eased = 0.5 - Math.cos(Math.PI * t) / 2;
      progress.set((ok ? eased : Math.min(eased, 0.9)) * 100);

      const f = Math.min(FRAMES - 1, Math.floor(t * FRAMES));
      if (f !== frameRef.current) {
        frameRef.current = f;
        setFrame(f);
      }

      if (t >= 1 && ok && !finished) {
        finished = true;
        void finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [reduce, progress]);

  /* 2 — Landing: measure the navbar slot and fly the logo into it */
  useEffect(() => {
    if (phase !== 'landing') return;
    const fly = flyRef.current;
    const slot = navLogoRef.current;
    if (!fly || !slot) {
      setPhase('done');
      return;
    }
    const a = fly.getBoundingClientRect();
    const b = slot.getBoundingClientRect();
    let cancelled = false;

    controls
      .start({
        x: b.left - a.left,
        y: b.top - a.top,
        scale: b.width / a.width,
        transition: { duration: 1.5, ease: EASE_IO },
      })
      .then(() => {
        if (!cancelled) setPhase('done');
      });

    return () => {
      cancelled = true;
    };
  }, [phase, controls]);

  /* 3 — Lock scroll until the intro is finished */
  useEffect(() => {
    document.body.style.overflow = phase === 'done' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  /* 4 — Hero slideshow starts once everything has landed */
  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [ready]);

  const loopedPartners = [...PARTNERS, ...PARTNERS]; // exactly 2 copies → seamless -50% loop

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ============================ LOADER ============================ */}
      {phase !== 'done' && (
        <>
          {/* Black curtain + "INTERIOR + FURNITURE STUDIO" fill indicator */}
          <motion.div
            aria-hidden="true"
            className={`${font} fixed inset-0 z-[60] bg-black`}
            initial={false}
            animate={{ clipPath: landed ? 'inset(0 0 100% 0)' : 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.25, delay: 0.15, ease: EASE_IO }}
          >
            <motion.div
              className="absolute inset-x-0 bottom-[9.5vh] flex justify-center"
              initial={false}
              animate={{ opacity: phase === 'loading' ? 1 : 0, y: phase === 'loading' ? 0 : 10 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span className="relative whitespace-nowrap text-[14px] font-bold uppercase tracking-[0.01em] sm:text-[15px]">
                <span className="text-white/25">Interior + Furniture Studio</span>
                <motion.span
                  className="absolute inset-0 text-white"
                  style={{ clipPath: fillClip }}
                >
                  Interior + Furniture Studio
                </motion.span>
              </span>
            </motion.div>
          </motion.div>

          {/* The logo: masked shutter images → solid white → flies to navbar */}
          <div
            aria-hidden="true"
            className={`${font} pointer-events-none fixed inset-0 z-[70] flex items-center justify-center`}
          >
            <motion.div
              ref={flyRef}
              animate={controls}
              className="relative aspect-[143/67]"
              style={{ width: 'clamp(240px, 26.6vw, 460px)', transformOrigin: '0 0' }}
            >
              <motion.div
                className="absolute inset-0 bg-white/10"
                style={maskStyle}
                initial={false}
                animate={{ opacity: phase === 'loading' ? 1 : 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {frame > 0 && (
                  <div
                    key={`p-${frame - 1}`}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${LOADER_IMAGES[(frame - 1) % LOADER_IMAGES.length]})`,
                    }}
                  />
                )}
                <ShutterLayer key={`s-${frame}`} src={LOADER_IMAGES[frame % LOADER_IMAGES.length]} />
              </motion.div>

              <LogoSvg intro solid={phase !== 'loading'} heavy={landed} />
            </motion.div>
          </div>
        </>
      )}

      {/* ============================== HERO ============================ */}
      <section
        className={`${font} relative isolate flex h-[100svh] min-h-[620px] w-full flex-col overflow-hidden bg-white`}
      >
        {/* ---------- Image area ---------- */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ scale: landed ? 1 : 1.18 }}
            transition={{ duration: 2.8, ease: EASE_OUT }}
          >
            {SLIDES.map((s, i) => {
              const active = i === current;
              return (
                <motion.div
                  key={s.id}
                  className="absolute inset-0"
                  style={{ zIndex: active ? 2 : 1 }}
                  initial={false}
                  animate={{ opacity: active ? 1 : 0 }}
                  transition={{
                    opacity: active
                      ? { duration: 1.6, ease: 'easeInOut' }
                      : { duration: 0, delay: 1.6 },
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={{ scale: active ? 1 : 1.07 }}
                    transition={{ duration: active ? 7 : 1.6, ease: 'linear' }}
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="100vw"
                      priority={i === 0}
                      onLoad={i === 0 ? () => (heroLoaded.current = true) : undefined}
                      className="object-cover"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Scrims live inside the slideshow so the letters get the same tint */}
          <div className="pointer-events-none absolute inset-0 z-[3] bg-black/10" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-40 bg-gradient-to-b from-black/35 to-transparent" />
        </div>

        {/* Spacer: takes the place of the old image area */}
        <div className="min-h-0 flex-1" aria-hidden="true" />

        {/* ---------- Navbar ---------- */}
        <header className="absolute inset-x-0 top-0 z-40 flex items-start justify-between px-[3.5vw] pt-[19px]">
          {/* Landing slot for the flying logo */}
          <a
            ref={navLogoRef}
            href="#"
            className="relative block aspect-[143/67] w-[clamp(84px,6.8vw,104px)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="sr-only">Taruna Interior Gallery — home</span>
            {phase === 'done' && <LogoSvg solid heavy />}
          </a>

          <motion.nav
            aria-label="Primary"
            className="flex h-[46px] items-center overflow-hidden rounded-[10px] bg-white"
            initial={false}
            animate={{ clipPath: ready ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)' }}
            transition={{ duration: 1, ease: EASE_IO }}
          >
            <motion.ul
              className="hidden items-center gap-[52px] px-10 md:flex h-full"
              initial={false}
              animate={{ opacity: ready ? 1 : 0 }}
              transition={{ duration: 0.6, delay: ready ? 0.55 : 0 }}
            >
              {NAV.map((n) => (
                <li key={n.label}className="flex items-center h-full">
                  <a
                    href={n.href}
                    className="relative text-[12px] font-regular uppercase text-black after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </motion.ul>

         <button
  type="button"
  onClick={() => setContactOpen(true)}
  aria-haspopup="dialog"
  aria-label="Open contact form"
  className="group flex items-stretch h-[44px] mr-[1px] rounded-[10px] bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
>
                {/* Left Section: Text */}
                <span className="flex items-center px-[18px] text-[14px] font-medium uppercase text-white transition-colors">
                  Contact
                </span>

                {/* Right Section Container */}
                <span className="relative flex w-[45px] items-center justify-center">
                  {/* The Vertical Needle Line (Scaled down 2px to 36px tall, centered vertically on the left) */}
                  <svg 
                    width="1" 
                    height="38" 
                    viewBox="0 0 1 38" 
                    fill="none" 
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-0 inset-y-0 my-auto h-[36px]"
                  >
                    <path d="M0.5 -2.18557e-08C0.466667 0.633333 0.435 1.26667 0.405 1.9C0.135 7.6 5.81361e-07 13.3 8.30516e-07 19C1.07967e-06 24.7 0.135001 30.4 0.405002 36.1C0.435002 36.7333 0.466668 37.3667 0.500002 38C0.533335 37.3667 0.565002 36.7333 0.595002 36.1C0.865001 30.4 1 24.7 1 19C1 13.3 0.865 7.6 0.595 1.9C0.565 1.26667 0.533333 0.633333 0.5 -2.18557e-08Z" fill="white" fill-opacity="0.4"/>
                  </svg>

                  {/* New Filled Orange Arrow */}
                  <svg 
                    viewBox="0 0 26 26" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" 
                  >
                    <path d="M2.74167 25.4583L0 22.7167L18.8 3.91667H1.95833V0H25.4583V23.5H21.5417V6.65833L2.74167 25.4583Z" fill="#FF5C05"/>
                  </svg>
                </span>
              </button>

          </motion.nav>
        </header>
        

        {/* ---------- Location tab + client marquee ---------- */}
        <motion.div
          className="relative z-10 mb-[4px] flex h-[68px] shrink-0 items-stretch bg-black"
          initial={false}
          animate={{ clipPath: ready ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
          transition={{ duration: 1.1, delay: ready ? 0.15 : 0, ease: EASE_IO }}
        >

           <div className="relative flex w-[15vw] min-w-[150px] shrink-0 items-center justify-center overflow-hidden rounded-r-[12px] bg-white px-3">        
            {/* --------------------------------------------------------- */}

            <span
              className="relative z-10 whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.01em] md:text-[14px]"
              style={{ color: ORANGE }}
            >
              {LOCATION}
              <sup className="ml-1 text-[9px]">©</sup>
            </span>
          </div>
          {/* <div className="flex w-[15vw] min-w-[150px] shrink-0 items-center justify-center rounded-r-[12px] bg-white px-3">
            <span
              className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.01em] md:text-[14px]"
              style={{ color: ORANGE }}
            >
              {LOCATION}
              <sup className="ml-1 text-[9px]">©</sup>
            </span>
          </div> */}

          <div className="tz-fade relative flex flex-1 items-center overflow-hidden">
            <div className="tz-pan flex items-center">
              {loopedPartners.map((p, i) => (
                <div
                  key={`${p.id}-${i}`}
                  className="relative mr-8 h-7 w-[110px] shrink-0 opacity-90 brightness-0 invert transition-opacity duration-300 hover:opacity-100 md:mr-12 md:h-9 md:w-[130px]"
                >
                  <Image
                    src={p.src}
                    alt={`${p.name} logo`}
                    fill
                    sizes="130px"
                    className="object-contain object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ---------- Headline: white sheet with the letters cut out ---------- */}
            <div className="relative flex h-[25vh] min-h-[150px] shrink-0 items-center bg-white px-[3.5vw] mix-blend-screen">
              <h1 className="sr-only">{HEADLINE}</h1>

              <div className="overflow-hidden py-[0.04em]">
                <motion.div
                  className="w-fit"
                  initial={false}
                  animate={{ y: ready ? '0%' : '110%' }}
                  transition={{ duration: 1.3, delay: ready ? 0.25 : 0, ease: EASE_OUT }}
                >
                  <div
                    aria-hidden="true"
                    className="select-none whitespace-nowrap text-[12.5vw] font-black uppercase leading-[0.95] tracking-[-0.02em] text-black md:text-[min(10.8vw,20vh)]"
                  >
                    {HEADLINE}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Scroll cue: sits outside the blended sheet so it keeps its green colour */}
            <motion.button
              type="button"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="absolute bottom-[5vh] right-[3.5vw] z-20 flex items-center gap-2 text-[#2f5a1e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2f5a1e]"
              initial={false}
              animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
              transition={{ duration: 0.9, delay: ready ? 1 : 0, ease: EASE_OUT }}
            >
              <svg
                viewBox="0 0 16 16"
                className="tz-nudge h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M8 2v11M3 8.5L8 13.5l5-5" />
              </svg>
              <span className="text-[10px] font-bold uppercase md:text-[12px]">Scroll down</span>
            </motion.button>
      </section>
       <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        imageSrc="/image/background/johannes-sejer-Xn3vcIpPi1E-unsplash.jpg"
      />
    </>
  );
}




// 'use client';
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';

// const slides = [
//   {
//     id: 1,
//     image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
//     title: 'The Atharva Project',
//   },
//   {
//     id: 2,
//     image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
//     title: 'Lumina Penthouse',
//   },
//   {
//     id: 3,
//     image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop',
//     title: 'Vanguard Workspace',
//   },
//   {
//     id: 4,
//     image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
//     title: 'Oak & Iron Villa',
//   }
// ];

// const partners = [
//   { id: 'p2', name: 'Nexa', src: '/ClientCarousel/Amar cars.png' },
//   { id: 'p3', name: 'Skechers', src: '/ClientCarousel/CORP_SKX_S_SHIFTED_1COLOR-logo.png' },
//   { id: 'p5', name: 'SHAILY', src: '/ClientCarousel/shaily-logos-02.png' },
//   { id: 'p12', name: 'HIMALAYA', src: '/ClientCarousel/WhatsApp-Image-2025-08-29-at-4.57.png' },
//   { id: 'p6', name: 'Alembic', src: '/ClientCarousel/veda-2.png' },
//   { id: 'p7', name: 'GXP', src: '/ClientCarousel/web-logo-GXP.png' },
//   { id: 'p8', name: 'Ronak Group', src: '/ClientCarousel/RonakGroup.png' },
//   { id: 'p9', name: 'Jayant Agro-Organics LTD.', src: '/ClientCarousel/logo-new.png' },
//   { id: 'p10', name: 'Parth Electricals & Engineering Limited', src: '/ClientCarousel/Parth Electricals & Engineering Limited.png' },
//   { id: 'p11', name: 'Shree Jagdamba Jewllers', src: '/ClientCarousel/Group 66.png' },
//   { id: 'p12', name: 'Aarya Bliss', src: '/ClientCarousel/aarya bliss.png' },
//   { id: 'p13', name: 'Zillion Group', src: '/ClientCarousel/zillion.png' },
//   { id: 'p14', name: 'Maruti Heights', src: '/ClientCarousel/marutiheights.png' },
//   { id: 'p15', name: 'Aiden Web Solution', src: '/ClientCarousel/aiden.png' }
// ];

// const contentVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.2, delayChildren: 1.8 } 
//   }
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
//   visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
// };

// export default function UnifiedHero() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const img = new window.Image();
//     img.src = slides[0].image;

//     const duration = 2800; 
//     const interval = 25;
//     const steps = duration / interval;
//     let currentStep = 0;

//     const timer = setInterval(() => {
//       currentStep++;
//       const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
//       setProgress(newProgress);

//       if (currentStep >= steps) {
//         clearInterval(timer);
//         setTimeout(() => setIsLoading(false), 400); 
//       }
//     }, interval);

//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     if (isLoading) return;
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 6000); 
//     return () => clearInterval(timer);
//   }, [isLoading]);

//   return (
//     <>
//       <AnimatePresence>
//         {isLoading && (
//           <motion.div
//             key="preloader"
//             initial={{ opacity: 1 }}
//             exit={{ opacity: 0, y: "-100%" }} 
//             transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
//             className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black w-full h-screen"
//           >
//             {/* Top Left Text */}
//             <div className="absolute top-8 left-8 md:top-12 md:left-12">
//               <p className="text-white text-sm md:text-xl font-bold tracking-widest uppercase">
//                 Interior + Furniture Studio
//               </p>
//             </div>

//             {/* Giant Centered Logo */}
//             <div className="relative flex justify-center items-center w-[85vw] max-w-[600px] md:max-w-[750px] mx-auto mt-[-5vh]">
//               <svg className="w-full h-auto drop-shadow-2xl" viewBox="0 0 143 67" fill="none" xmlns="http://www.w3.org/2000/svg">          
//                 <path d="M12.9023 13.4062V39H6.87305V13.4062H12.9023ZM19.1074 13.4062V18.1699H0.84375V13.4062H19.1074ZM27.5027 18.7852L22.7391 39H16.2703L24.1629 13.4062H28.2059L27.5027 18.7852ZM31.2293 39L26.4656 18.7852L25.6746 13.4062H29.7879L37.698 39H31.2293ZM31.4227 29.4551V34.2188H20.3309V29.4551H31.4227ZM37.8492 13.4062H46.6031C48.3141 13.4062 49.7965 13.6992 51.0504 14.2852C52.3043 14.8711 53.2652 15.7383 53.9332 16.8867C54.6129 18.0352 54.9527 19.4531 54.9527 21.1406C54.9527 22.6055 54.7652 23.8301 54.3902 24.8145C54.027 25.7988 53.5113 26.6133 52.8434 27.2578C52.1754 27.8906 51.3902 28.4121 50.4879 28.8223L48.5367 29.9648H41.6637L41.6285 25.2012H46.4625C47.0133 25.2012 47.4703 25.0605 47.8336 24.7793C48.1969 24.498 48.4664 24.0996 48.6422 23.584C48.8297 23.0566 48.9234 22.4297 48.9234 21.7031C48.9234 20.9648 48.8355 20.332 48.6598 19.8047C48.484 19.2773 48.2262 18.873 47.8863 18.5918C47.5582 18.3105 47.1305 18.1699 46.6031 18.1699H43.8609V39H37.8492V13.4062ZM49.1871 39L44.652 27.6797L51.0152 27.6445L55.6383 38.7363V39H49.1871ZM67.7426 13.4062H73.7719V30.8262C73.7719 32.8184 73.4145 34.4473 72.6996 35.7129C71.9848 36.9668 70.9828 37.8867 69.6937 38.4727C68.4047 39.0586 66.8812 39.3516 65.1234 39.3516C63.3773 39.3516 61.8539 39.0586 60.5531 38.4727C59.2523 37.8867 58.2328 36.9668 57.4945 35.7129C56.768 34.4473 56.4047 32.8184 56.4047 30.8262V13.4062H62.4516V30.8262C62.4516 31.8809 62.5453 32.6836 62.7328 33.2344C62.932 33.7734 63.2309 34.1367 63.6293 34.3242C64.0277 34.5117 64.5258 34.6055 65.1234 34.6055C65.7328 34.6055 66.2309 34.5117 66.6176 34.3242C67.0043 34.1367 67.2855 33.7734 67.4613 33.2344C67.6488 32.6836 67.7426 31.8809 67.7426 30.8262V13.4062ZM93.8918 13.4062V39H87.8977L81.4816 23.0742V39H75.4699V13.4062H81.4816L87.8977 29.332V13.4062H93.8918ZM105.557 18.7852L100.793 39H94.3242L102.217 13.4062H106.26L105.557 18.7852ZM109.283 39L104.52 18.7852L103.729 13.4062H107.842L115.752 39H109.283ZM109.477 29.4551V34.2188H98.3848V29.4551H109.477Z" fill="white"/>
//                 <path d="M4.30078 1.46875V10H2.29102V1.46875H4.30078ZM6.36914 1.46875V3.05664H0.28125V1.46875H6.36914ZM11.441 4.85547V6.4375H7.98398V4.85547H11.441ZM8.64023 1.46875V10H6.63633V1.46875H8.64023ZM12.7945 1.46875V10H10.7906V1.46875H12.7945ZM18.3879 8.41797V10H14.6555V8.41797H18.3879ZM15.3527 1.46875V10H13.3488V1.46875H15.3527ZM17.9016 4.85547V6.38477H14.6555V4.85547H17.9016ZM18.4055 1.46875V3.05664H14.6555V1.46875H18.4055Z" fill="white"/>
//                 <path d="M2.67773 42.4688V51H0.679688V42.4688H2.67773ZM9.48398 42.4688V51H7.48594L5.34727 45.6914V51H3.34336V42.4688H5.34727L7.48594 47.7773V42.4688H9.48398ZM13.6008 42.4688V51H11.591V42.4688H13.6008ZM15.6691 42.4688V44.0566H9.58125V42.4688H15.6691ZM20.9754 49.418V51H17.243V49.418H20.9754ZM17.9402 42.4688V51H15.9363V42.4688H17.9402ZM20.4891 45.8555V47.3848H17.243V45.8555H20.4891ZM20.993 42.4688V44.0566H17.243V42.4688H20.993ZM21.2016 42.4688H24.1195C24.6898 42.4688 25.184 42.5664 25.602 42.7617C26.0199 42.957 26.3402 43.2461 26.5629 43.6289C26.7895 44.0117 26.9027 44.4844 26.9027 45.0469C26.9027 45.5352 26.8402 45.9434 26.7152 46.2715C26.5941 46.5996 26.4223 46.8711 26.1996 47.0859C25.977 47.2969 25.7152 47.4707 25.4145 47.6074L24.7641 47.9883H22.473L22.4613 46.4004H24.0727C24.2563 46.4004 24.4086 46.3535 24.5297 46.2598C24.6508 46.166 24.7406 46.0332 24.7992 45.8613C24.8617 45.6855 24.893 45.4766 24.893 45.2344C24.893 44.9883 24.8637 44.7773 24.8051 44.6016C24.7465 44.4258 24.6605 44.291 24.5473 44.1973C24.4379 44.1035 24.2953 44.0566 24.1195 44.0566H23.2055V51H21.2016V42.4688ZM24.9809 51L23.4691 47.2266L25.5902 47.2148L27.1313 50.9121V51H24.9809ZM29.502 42.4688V51H27.5039V42.4688H29.502ZM36.3668 46.0957V47.3848C36.3668 47.998 36.2906 48.5371 36.1383 49.002C35.9859 49.4668 35.7691 49.8574 35.4879 50.1738C35.2066 50.4863 34.8727 50.7227 34.4859 50.8828C34.1031 51.0391 33.6773 51.1172 33.2086 51.1172C32.7359 51.1172 32.3062 51.0391 31.9195 50.8828C31.5328 50.7227 31.1988 50.4863 30.9176 50.1738C30.6363 49.8574 30.4195 49.4668 30.2672 49.002C30.1148 48.5371 30.0387 47.998 30.0387 47.3848V46.0957C30.0387 45.4824 30.1148 44.9414 30.2672 44.4727C30.4195 44.0039 30.6344 43.6133 30.9117 43.3008C31.193 42.9883 31.527 42.752 31.9137 42.5918C32.3004 42.4316 32.7301 42.3516 33.2027 42.3516C33.6715 42.3516 34.0992 42.4316 34.4859 42.5918C34.8766 42.752 35.2105 42.9883 35.4879 43.3008C35.7652 43.6133 35.9801 44.0039 36.1324 44.4727C36.2887 44.9414 36.3668 45.4824 36.3668 46.0957ZM34.3336 47.3848V46.084C34.3336 45.7012 34.3102 45.375 34.2633 45.1055C34.2164 44.8359 34.1461 44.6172 34.0523 44.4492C33.9586 44.2812 33.8414 44.1582 33.7008 44.0801C33.5602 44.002 33.3941 43.9629 33.2027 43.9629C33.0035 43.9629 32.8336 44.002 32.693 44.0801C32.5523 44.1582 32.4352 44.2812 32.3414 44.4492C32.2516 44.6172 32.1852 44.8359 32.1422 45.1055C32.0992 45.375 32.0777 45.7012 32.0777 46.084V47.3848C32.0777 47.7637 32.0992 48.0879 32.1422 48.3574C32.1852 48.623 32.2516 48.8418 32.3414 49.0137C32.4352 49.1855 32.5543 49.3125 32.6988 49.3945C32.8434 49.4727 33.0133 49.5117 33.2086 49.5117C33.3961 49.5117 33.5602 49.4727 33.7008 49.3945C33.8453 49.3125 33.9625 49.1855 34.0523 49.0137C34.1461 48.8418 34.2164 48.623 34.2633 48.3574C34.3102 48.0879 34.3336 47.7637 34.3336 47.3848ZM36.8156 42.4688H39.7336C40.3039 42.4688 40.798 42.5664 41.216 42.7617C41.634 42.957 41.9543 43.2461 42.177 43.6289C42.4035 44.0117 42.5168 44.4844 42.5168 45.0469C42.5168 45.5352 42.4543 45.9434 42.3293 46.2715C42.2082 46.5996 42.0363 46.8711 41.8137 47.0859C41.591 47.2969 41.3293 47.4707 41.0285 47.6074L40.3781 47.9883H38.0871L38.0754 46.4004H39.6867C39.8703 46.4004 40.0227 46.3535 40.1437 46.2598C40.2648 46.166 40.3547 46.0332 40.4133 45.8613C40.4758 45.6855 40.507 45.4766 40.507 45.2344C40.507 44.9883 40.4777 44.7773 40.4191 44.6016C40.3605 44.4258 40.2746 44.291 40.1613 44.1973C40.052 44.1035 39.9094 44.0566 39.7336 44.0566H38.8195V51H36.8156V42.4688ZM40.5949 51L39.0832 47.2266L41.2043 47.2148L42.7453 50.9121V51H40.5949ZM46.5984 48.7324C46.5984 48.5996 46.5848 48.4805 46.5574 48.375C46.534 48.2656 46.4852 48.1641 46.4109 48.0703C46.3406 47.9766 46.2332 47.8828 46.0887 47.7891C45.9441 47.6914 45.7508 47.5898 45.5086 47.4844C45.2039 47.3594 44.9051 47.2188 44.6121 47.0625C44.3191 46.9023 44.0555 46.7168 43.8211 46.5059C43.5906 46.291 43.4051 46.041 43.2645 45.7559C43.1238 45.4668 43.0535 45.1309 43.0535 44.748C43.0535 44.3809 43.1238 44.0508 43.2645 43.7578C43.409 43.4609 43.6063 43.209 43.8563 43.002C44.1102 42.791 44.409 42.6309 44.7527 42.5215C45.0965 42.4082 45.4715 42.3516 45.8777 42.3516C46.4168 42.3516 46.8914 42.4609 47.3016 42.6797C47.7156 42.8945 48.0379 43.2012 48.2684 43.5996C48.5027 43.9941 48.6199 44.4609 48.6199 45H46.6219C46.6219 44.7852 46.5945 44.5957 46.5398 44.4316C46.4852 44.2676 46.3992 44.1387 46.282 44.0449C46.1688 43.9512 46.0184 43.9043 45.8309 43.9043C45.6629 43.9043 45.5203 43.9434 45.4031 44.0215C45.2898 44.0996 45.2039 44.2051 45.1453 44.3379C45.0867 44.4668 45.0574 44.6094 45.0574 44.7656C45.0574 44.8945 45.0867 45.0117 45.1453 45.1172C45.2039 45.2188 45.284 45.3145 45.3855 45.4043C45.491 45.4941 45.6121 45.5801 45.7488 45.6621C45.8895 45.7441 46.0398 45.8242 46.2 45.9023C46.5867 46.0469 46.9285 46.209 47.2254 46.3887C47.5262 46.5645 47.7781 46.7656 47.9813 46.9922C48.1844 47.2148 48.3367 47.4688 48.4383 47.7539C48.5438 48.0391 48.5965 48.3613 48.5965 48.7207C48.5965 49.1035 48.534 49.4434 48.409 49.7402C48.2879 50.0371 48.1102 50.2891 47.8758 50.4961C47.6414 50.6992 47.3582 50.8535 47.0262 50.959C46.698 51.0645 46.327 51.1172 45.9129 51.1172C45.534 51.1172 45.1609 51.0625 44.7938 50.9531C44.4305 50.8398 44.1004 50.668 43.8035 50.4375C43.5105 50.2031 43.2762 49.9043 43.1004 49.541C42.9246 49.1738 42.8367 48.7383 42.8367 48.2344H44.8523C44.8523 48.4844 44.8719 48.6953 44.9109 48.8672C44.95 49.0391 45.0105 49.1777 45.0926 49.2832C45.1785 49.3848 45.2879 49.459 45.4207 49.5059C45.5535 49.5488 45.7176 49.5703 45.9129 49.5703C46.0926 49.5703 46.2313 49.5332 46.3289 49.459C46.4305 49.3809 46.5008 49.2793 46.5398 49.1543C46.5789 49.0254 46.5984 48.8848 46.5984 48.7324ZM57.2109 46.4414V50.0039C57.0781 50.1328 56.8828 50.2852 56.625 50.4609C56.3672 50.6367 56.043 50.791 55.6523 50.9238C55.2656 51.0527 54.8086 51.1172 54.2812 51.1172C53.793 51.1172 53.3535 51.043 52.9629 50.8945C52.5723 50.7461 52.2383 50.5215 51.9609 50.2207C51.6875 49.916 51.4766 49.5352 51.3281 49.0781C51.1797 48.6172 51.1055 48.0723 51.1055 47.4434V46.0312C51.1055 45.4062 51.1797 44.8613 51.3281 44.3965C51.4805 43.9316 51.6934 43.5488 51.9668 43.248C52.2402 42.9473 52.5645 42.7227 52.9395 42.5742C53.3145 42.4219 53.7305 42.3457 54.1875 42.3457C54.8711 42.3457 55.4316 42.4609 55.8691 42.6914C56.3105 42.9219 56.6406 43.2539 56.8594 43.6875C57.0781 44.1172 57.1934 44.6387 57.2051 45.252H55.2832C55.2676 44.9277 55.2207 44.668 55.1426 44.4727C55.0645 44.2773 54.9531 44.1387 54.8086 44.0566C54.6641 43.9707 54.4805 43.9277 54.2578 43.9277C54.0781 43.9277 53.918 43.9629 53.7773 44.0332C53.6406 44.1035 53.5234 44.2207 53.4258 44.3848C53.332 44.5449 53.2598 44.7598 53.209 45.0293C53.1621 45.2988 53.1387 45.6289 53.1387 46.0195V47.4434C53.1387 47.8301 53.1621 48.1582 53.209 48.4277C53.2559 48.6973 53.3281 48.9121 53.4258 49.0723C53.5234 49.2324 53.6543 49.3496 53.8184 49.4238C53.9824 49.498 54.1855 49.5352 54.4277 49.5352C54.5762 49.5352 54.6992 49.5156 54.7969 49.4766C54.8945 49.4375 54.9766 49.3926 55.043 49.3418C55.1094 49.291 55.1641 49.2559 55.207 49.2363V47.8535H54.1875V46.4414H57.2109ZM60.9176 44.2617L59.3297 51H57.1734L59.8043 42.4688H61.152L60.9176 44.2617ZM62.1598 51L60.5719 44.2617L60.3082 42.4688H61.6793L64.316 51H62.1598ZM62.2242 47.8184V49.4062H58.527V47.8184H62.2242ZM69.2473 49.418V51H65.6613V49.418H69.2473ZM66.3645 42.4688V51H64.3605V42.4688H66.3645ZM74.4012 49.418V51H70.8152V49.418H74.4012ZM71.5184 42.4688V51H69.5145V42.4688H71.5184ZM79.7074 49.418V51H75.975V49.418H79.7074ZM76.6723 42.4688V51H74.6684V42.4688H76.6723ZM79.2211 45.8555V47.3848H75.975V45.8555H79.2211ZM79.725 42.4688V44.0566H75.975V42.4688H79.725ZM79.9336 42.4688H82.8516C83.4219 42.4688 83.916 42.5664 84.334 42.7617C84.752 42.957 85.0723 43.2461 85.2949 43.6289C85.5215 44.0117 85.6348 44.4844 85.6348 45.0469C85.6348 45.5352 85.5723 45.9434 85.4473 46.2715C85.3262 46.5996 85.1543 46.8711 84.9316 47.0859C84.709 47.2969 84.4473 47.4707 84.1465 47.6074L83.4961 47.9883H81.2051L81.1934 46.4004H82.8047C82.9883 46.4004 83.1406 46.3535 83.2617 46.2598C83.3828 46.166 83.4727 46.0332 83.5312 45.8613C83.5938 45.6855 83.625 45.4766 83.625 45.2344C83.625 44.9883 83.5957 44.7773 83.5371 44.6016C83.4785 44.4258 83.3926 44.291 83.2793 44.1973C83.1699 44.1035 83.0273 44.0566 82.8516 44.0566H81.9375V51H79.9336V42.4688ZM83.7129 51L82.2012 47.2266L84.3223 47.2148L85.8633 50.9121V51H83.7129ZM87.4898 42.4688L88.5855 46.1719L89.6871 42.4688H91.8375L89.6109 47.9355V51H87.5719V47.9355L85.3395 42.4688H87.4898Z" fill="white"/>
//                 <path d="M92.102 51.008V49.544H93.566V51.008H92.102Z" fill="#FF5C05"/>
//                 <path d="M20.2553 10L115 10.0002C117.209 10.0002 119 11.7911 119 14.0002V50C119 52.2091 117.209 54 115 54H0" stroke="white" strokeWidth="0.8"/>
//               </svg>
//             </div>

//             {/* Progress Bar (Bottom) */}
//             <div className="absolute bottom-16 md:bottom-24 w-full md:w-[80%] max-w-4xl px-8">
//               <div 
//                 className="absolute -top-8 text-white text-sm md:text-base font-bold transition-all duration-75 ease-linear"
//                 style={{ left: `calc(${progress}% + ${progress > 5 ? 24 : 32}px)`, transform: 'translateX(-50%)' }}
//               >
//                 {progress}%
//               </div>
//               <div className="w-full h-[2px] bg-white/20">
//                 <div 
//                   className="h-full bg-white transition-all duration-75 ease-linear"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <section className="relative flex flex-col justify-end w-full h-screen min-h-[800px] overflow-hidden bg-black pb-[110px] md:pb-[140px] pt-24">
        
//         <style dangerouslySetInnerHTML={{__html: `
//           @keyframes infinite-pan {
//             0% { transform: translateX(0); }
//             100% { transform: translateX(-50%); }
//           }
//           .animate-infinite-pan {
//             animation: infinite-pan 45s linear infinite; 
//             width: max-content;
//           }
//           .fade-edges {
//             mask-image: linear-gradient(to right, transparent, black 2%, black 98%, transparent);
//             -webkit-mask-image: linear-gradient(to right, transparent, black 2%, black 98%, transparent);
//           }
//         `}} />

//         <div className="absolute inset-0 z-0 w-full h-full">
//           <AnimatePresence mode="popLayout">
//             {!isLoading && (
//               <motion.div
//                 key={currentSlide}
//                 initial={{ opacity: 0, scale: 1.4, filter: "blur(20px)" }}
//                 animate={{ opacity: 1, scale: 1.05, filter: "blur(0px)" }} 
//                 exit={{ opacity: 0, transition: { duration: 1.5 } }}
//                 transition={{ duration: 2, ease: "easeOut" }} 
//                 className="absolute inset-0 w-full h-full"
//               >
//                 <Image 
//                   src={slides[currentSlide].image}
//                   alt={slides[currentSlide].title}
//                   fill
//                   sizes="100vw"
//                   priority={currentSlide === 0} 
//                   className="object-cover transition-transform duration-[10s]"
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>
          
//           <div className="absolute inset-0 z-10 bg-black/20" />
//           <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
//         </div>

//         {!isLoading && (
//           <motion.div 
//             variants={contentVariants}
//             initial="hidden"
//             animate="visible"
//             className="relative z-20 w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16"
//           >
//             <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 w-full mb-8">
//               <motion.h1 
//                 variants={itemVariants} 
//                 className="text-[14vw] md:text-[8vw] lg:text-[92px] leading-[0.3] lg:leading-[92px] text-white uppercase drop-shadow-2xl"
//                 style={{ 
//                   fontFamily: '"Roboto Condensed", sans-serif', 
//                   fontWeight: 800, 
//                   letterSpacing: '-0.065em' 
//                 }}
//               >
//                 DESIGNING SPACES, <br/> THAT REFLECT YOU.
//               </motion.h1>

//               <motion.p 
//                 variants={itemVariants}
//                 className="text-white text-[11px] md:text-[13px] leading-[1.8] lg:text-right drop-shadow-md pb-6 md:pb-8"
//                 style={{ fontFamily: '"Roboto Mono", monospace' }}
//               >
//                 Elegant, functional interiors<br/>
//                 crafted with precision and<br/>
//                 inspired by modern luxury living.
//               </motion.p>
//             </div>
//           </motion.div>
//         )}

//         {!isLoading && (
//           <motion.div 
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }} 
//             className="absolute bottom-6 md:bottom-10 left-0 w-full border-t border-b border-white/20 h-[80px] md:h-[100px] flex items-stretch z-30"
//           >
//             <div className="flex-1 overflow-hidden relative flex items-center fade-edges">
//               <div className="animate-infinite-pan flex items-center gap-16 md:gap-24 px-8">
//                 {[...partners, ...partners, ...partners].map((partner, index) => (
//                   <div 
//                     key={`${partner.id}-${index}`} 
//                     className="relative h-7 md:h-9 w-[110px] md:w-[130px] brightness-0 invert opacity-90 transition-opacity duration-300 hover:opacity-100 cursor-pointer shrink-0"
//                   >
//                     <Image 
//                       src={partner.src}
//                       alt={`${partner.name} Logo`}
//                       fill
//                       sizes="130px"
//                       className="object-contain object-center"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="hidden md:flex w-[220px] lg:w-[280px] shrink-0 border-l border-white/20 items-center justify-center">
//               <span 
//                 className="text-white text-[11px] md:text-[12px] uppercase tracking-widest whitespace-nowrap"
//                 style={{ fontFamily: '"Roboto Mono", monospace' }}
//               >
//                 VADODARA, GUJ
//               </span>
//             </div>
//           </motion.div>
//         )}

//         {!isLoading && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 2.2 }}
//             className="absolute bottom-2 left-0 w-full md:hidden flex justify-center z-30"
//           >
//             <span 
//               className="text-white/60 text-[10px] uppercase tracking-widest"
//               style={{ fontFamily: '"Roboto Mono", monospace' }}
//             >
//               VADODARA, GUJ
//             </span>
//           </motion.div>
//         )}

//       </section>
//     </>
//   );
// }