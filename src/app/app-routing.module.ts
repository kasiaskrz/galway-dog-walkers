import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
  },
  {
    path: 'offers',
    loadComponent: () => import('./pages/offers/offers.page').then(m => m.OffersPage),
  },
  {
    path: 'offer-details',
    loadComponent: () => import('./pages/offer-details/offer-details.page').then(m => m.OfferDetailsPage),
  },
  {
    path: 'create-offer',
    loadComponent: () => import('./pages/create-offer/create-offer.page').then(m => m.CreateOfferPage),
  },
  {
    path: 'dog-facts',
    loadComponent: () => import('./pages/dog-facts/dog-facts.page').then(m => m.DogFactsPage),
  },
  {
    path: 'create-walker-availability',
    loadComponent: () => import('./pages/create-walker-availability/create-walker-availability.page').then(m => m.CreateWalkerAvailabilityPage),
  },
  {
    path: 'walker-details',
    loadComponent: () => import('./pages/walker-details/walker-details.page').then(m => m.WalkerDetailsPage),
  },
  {
    path: 'my-posts',
    loadComponent: () => import('./pages/my-posts/my-posts.page').then(m => m.MyPostsPage),
  },
  
  
];
