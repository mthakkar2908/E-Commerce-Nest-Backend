import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TokenMiddleware } from './token.middleware';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { LoggerMiddleware } from './logger.middleware';
import { EmailSignupModule } from './email-signup/email-signup.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrivacyPolicyModule } from './Privacy-Policy/privacy.module';
import { TermsConditionsModule } from './terms-conditions/terms.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-project'),
    UsersModule,
    PostsModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    OrdersModule,
    CartModule,
    EmailSignupModule,
    PrivacyPolicyModule,
    TermsConditionsModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware, LoggerMiddleware)
      .exclude(
        { path: 'users/signIn', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
