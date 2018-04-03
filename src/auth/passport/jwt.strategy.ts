import * as passport from 'passport';
import {default as config} from '../../config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Component } from '@nestjs/common';
import { JWTService } from '../jwt.service';


@Component()
export class JwtStrategy extends Strategy {
  constructor(private readonly jwtService: JWTService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: config.jwt.secretOrKey,
      },
      async (req, payload, next) => await this.verify(req, payload, next)
    );
    passport.use(this);
  }

  

  public async verify(req, payload, done) {
    const isValid = await this.jwtService.validateUser(payload);
    if (!isValid) {
      return done('Unauthorized', false);
    }
    req.user = payload;
    done(null, payload);
  }
}
