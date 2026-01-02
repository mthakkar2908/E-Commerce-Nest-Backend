import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrderSchema } from './orders.schema';
import { User, UserSchema } from 'src/users/user.schema';
import { Products, ProductsSchema } from 'src/products/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Products.name, schema: ProductsSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
