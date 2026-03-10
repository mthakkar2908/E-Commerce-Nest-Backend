import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DashboardGateway {
  @WebSocketServer()
  server: Server;

  userAdded(user: any) {
    this.server.emit('userAdded', user);
  }

  productAdded(product: any) {
    this.server.emit('productAdded', product);
  }

  postAdded(post: any) {
    this.server.emit('postAdded', post);
  }

  orderAdded(order: any) {
    this.server.emit('orderAdded', order);
  }

  contactAdded(contact: any) {
    this.server.emit('contactAdded', contact);
  }

  categoryAdded(category: any) {
    this.server.emit('categoryAdded', category);
  }
}
