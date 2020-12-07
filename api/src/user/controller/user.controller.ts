import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Put, Req, UseGuards, Delete, Param } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { User } from '../models/user.entity';
import { UserService } from '../service/user.service';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../auth/service/auth.service';

@ApiTags('Users')
@Crud({
    model: {
        type: User,
    },
    // routes: {
    //     getManyBase?: {
    //         decorators?: [],
    //     },
    //     getOneBase?: {
    //         decorators?: [],
    //     },
    //     createOneBase?: {
    //         decorators?: [],
    //     },
    //     createManyBase?: {
    //         decorators?: [],
    //     },
    //     updateOneBase: {
    //         decorators?: [],
    //     },
    //     replaceOneBase: {
    //         decorators?: [],
    //     },
    //     deleteOneBase?: {
    //         decorators?: [],
    //     },
    // }
})
@Controller('users')
export class UserController {
    constructor(
        public service: UserService,
        private readonly authService: AuthService
    ) {}

    @ApiOkResponse({ description: 'Login user' })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req.user).catch(err => {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: err.message
            }, HttpStatus.BAD_REQUEST)
        });
    }

    @ApiCreatedResponse({ description: 'Register new user' })
    @Post('register')
    async register(@Req() req, @Body() body: CreateUserDto) {
        return this.service.createUser(body).catch(err => {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: err.message
            }, HttpStatus.BAD_REQUEST)
        });
    }

    @ApiOkResponse({ description: 'Get current user profile' })
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() { user }) {
        return this.service.getUser(user.id).catch(err => {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: err.message
            }, HttpStatus.BAD_REQUEST)
        })
    }

    @ApiNoContentResponse({ description: 'Edit current user profile' })
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async editProfile(@Req() { user }, @Body() body: UpdateUserDto) {
        return this.service.updateUser(user.id, body).catch(err => {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: err.message
            }, HttpStatus.BAD_REQUEST)
        });
    }

    @ApiNoContentResponse({ description: 'Add crypto user' })
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @Put('cryptos/:idCrypto')
    async addCrypto(@Req() { user }, @Param('idCrypto') idCrypto: number) {
        return this.service.addCrypto(user, idCrypto).catch(err => {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: err.message
            }, HttpStatus.BAD_REQUEST)
        });
    }

    @ApiNoContentResponse({ description: 'Remove crypto user' })
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @Delete('cryptos/:idCrypto')
    async removeCrypto(@Req() { user }, @Param('idCrypto') idCrypto: number) {
        return this.service.removeCrypto(user, idCrypto).catch(err => {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: err.message
            }, HttpStatus.BAD_REQUEST)
        });
    }
}