package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.AuthenticationDTO;
import br.unoeste.fipp.ativooperante2024.db.entities.LoginResponseDTO;
import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import br.unoeste.fipp.ativooperante2024.services.TokenService;
import br.unoeste.fipp.ativooperante2024.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("apis/security/")
public class AccessRestController
{
    @Autowired
    UsuarioService usuarioservice;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;
    @PostMapping("login")
    public ResponseEntity<Object> logar(@RequestBody AuthenticationDTO data)
    {
        var userNamePassword = new UsernamePasswordAuthenticationToken(data.email(),data.senha());
        try {
            var auth = this.authenticationManager.authenticate(userNamePassword);
            var token = tokenService.GenerateToken((Usuario) auth.getPrincipal());
            String email = tokenService.validateToken(token);
            Usuario aux = usuarioservice.getByEmail(email);
            return ResponseEntity.ok(new LoginResponseDTO(token, aux.getId()));
        }catch (Exception e)
        {
            try {
                var token = tokenService.GenerateToken(usuarioservice.getByEmail(data.email()));
                String senhaCodificada = passwordEncoder.encode(String.valueOf(data.senha()));
                String email = tokenService.validateToken(token);
                Usuario aux = usuarioservice.getByEmail(email);
                if(senhaCodificada.equals(aux.getSenha()))
                    return ResponseEntity.ok(new LoginResponseDTO(token, aux.getId()));
            }
            catch (Exception ex)
            {

            }

        }
        return null;
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/cadastrar-usuario")
    public ResponseEntity<Object> cadastrarUsuario(@RequestParam(value="cpf") String cpf,
                                                   @RequestParam(value="email") String email,
                                                   @RequestParam(value="senha") String senha) {
        try {
            // Codificar a senha antes de salvar
            String senhaCodificada = passwordEncoder.encode(String.valueOf(senha));
            Usuario usuario = new Usuario(cpf, email, senhaCodificada, 0);
            Usuario novoUsuario = usuarioservice.save(usuario);
            return new ResponseEntity<>(novoUsuario, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao cadastrar usuário: " + e.getMessage());
        }
    }
}
