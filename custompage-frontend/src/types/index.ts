export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: 'admin' | 'cliente';
}