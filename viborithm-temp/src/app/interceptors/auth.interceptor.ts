import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  // Не добавляем токен для внешних API
  const isExternal = req.url.includes('audd.io') || 
                     req.url.includes('rapidapi.com');
  
  if (isExternal) {
    return next(req);
  }

  const token = localStorage.getItem('access');
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(req);
};