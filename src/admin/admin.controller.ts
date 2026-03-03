import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDTO } from './dto/create-admin.dto';
import { SignInAdminDTO } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { ProductService } from 'src/products/products.service';
import { PostsService } from 'src/posts/posts.service';
import { OrdersService } from 'src/orders/orders.service';
import { ContactService } from 'src/contact/contact.service';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CategoryService } from 'src/category/category.service';

dayjs.extend(relativeTime);

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UsersService,
    private readonly productService: ProductService,
    private readonly postService: PostsService,
    private readonly orderService: OrdersService,
    private readonly contactService: ContactService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  create(@Body() body: CreateAdminDTO) {
    try {
      return this.adminService.create(body.email, body.password);
    } catch (error) {
      return error;
    }
  }

  @Post('signIn')
  async signIn(@Body() body: SignInAdminDTO) {
    try {
      const admin = await this.adminService.signIn(body.email, body.password);
      return { message: 'Logged In Successfully.', admin };
    } catch (error) {
      return error;
    }
  }
  @Get('count')
  async getUserCount() {
    const total = await this.userService.getTotalUsers();
    const totalProducts = await this.productService.getTotalProducts();
    const totalPosts = await this.postService.getTotalPosts();
    const totalOrders = await this.orderService.getTotalOrders();
    const totalContactForms = await this.contactService.getTotalContactForms();
    const totalCategoris = await this.categoryService.getTotalCategories();

    const lastUser = await this.userService.getLastUser();
    const lastOrder = await this.orderService.getLastOrder();
    const lastPost = await this.postService.getLastPosts();
    const lastContact = await this.contactService.getLastContact();
    const lastProduct = await this.productService.getLastProduct();
    const lastCategories = await this.categoryService.getLastCategories();

    return {
      totalUsers: total,
      totalProducts: totalProducts,
      totalPosts: totalPosts,
      totalOrders: totalOrders,
      totalContactForms: totalContactForms,
      totalCategoris: totalCategoris,
      lastUserAdded: lastUser ? dayjs(lastUser.createdAt).fromNow() : null,
      lastOrderAdded: lastOrder ? dayjs(lastOrder.createdAt).fromNow() : null,
      lastPostAdded: lastPost ? dayjs(lastPost.createdAt).fromNow() : null,
      lastContactAdded: lastContact
        ? dayjs(lastContact.createdAt).fromNow()
        : null,
      lastProductAdded: lastProduct
        ? dayjs(lastProduct.createdAt).fromNow()
        : null,
      lastCategoriesAdded: lastCategories
        ? dayjs(lastCategories.createdAt).fromNow()
        : null,
    };
  }

  @Post('logout')
  async logout(@Body() body: { email: string }) {
    return this.adminService.logout(body.email);
  }
}
