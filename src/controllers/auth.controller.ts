import { Request, Response } from 'express';

export function renderLogin(req: Request, res: Response) {
    res.render('auth/login')
}

export function renderSignup(req: Request, res: Response) {
    res.render('auth/signup')
}

export function renderForgot(req: Request, res: Response) {
    res.render('auth/forgot')
}

export function logout(req: Request, res: Response) {

}