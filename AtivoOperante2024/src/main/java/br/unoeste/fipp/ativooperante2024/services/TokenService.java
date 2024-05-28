package br.unoeste.fipp.ativooperante2024.services;

import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    public String GenerateToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create().withIssuer("apis/security/").withSubject(usuario.getEmail()).
                    withExpiresAt(generetionExpirationDate()).sign(algorithm);
            return token;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar o token", e);
        }
    }


    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String email = JWT.require(algorithm).
                    withIssuer("apis/security/").
                    build().
                    verify(token).
                    getSubject();
            return email;
        } catch (JWTVerificationException e) {
                return "";
        }
    }


        private Instant generetionExpirationDate(){
            return LocalDateTime.now().plusHours(24).toInstant(ZoneOffset.of("-03:00"));
        }

    }