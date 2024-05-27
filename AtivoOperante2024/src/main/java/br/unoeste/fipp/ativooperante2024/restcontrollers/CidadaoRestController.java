package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import br.unoeste.fipp.ativooperante2024.db.entities.Orgao;
import br.unoeste.fipp.ativooperante2024.db.entities.Tipo;
import br.unoeste.fipp.ativooperante2024.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("apis/cidadao/")

public class CidadaoRestController {
    @Autowired
    UsuarioService usuarioservice;

    @Autowired
    DenunciaService denunciaservice;

    @Autowired
    TipoService tiposervice;

    @Autowired
    OrgaoService orgaoservice;

    @Autowired
    FeedbackService feedbackService;

    @GetMapping("teste-conexao")
    public String testeConexao()
    {
        return "conectado";
    }


    @PostMapping("/add-usuario")
    public ResponseEntity<Object> salvarUsuario(@RequestBody Usuario usuario)
    {
        Usuario novo = usuarioservice.save(usuario);
        return new ResponseEntity<>(novo, HttpStatus.OK);
    }

    @PostMapping("cadastrar-denuncia")
    public ResponseEntity<String> cadastraDenuncia(@RequestParam("denunciaTitulo") String titulo,
                                                   @RequestParam("denunciaDescricao") String texto,
                                                   @RequestParam("denunciaUrgencia") int urgencia,
                                                   @RequestParam("denunciaOrgao") long orgaoId,
                                                   @RequestParam("denunciaTipoProblema") long tipoId,
                                                   @RequestParam("denunciaUsuario") long usuarioId) {
        try {
            List<Denuncia> denuncias = denunciaservice.getAll();
            if (denuncias.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro: Não há denúncias existentes para obter ID.");
            }
            Denuncia ultimaDenuncia = denuncias.get(denuncias.size() - 1);
            Orgao orgao = orgaoservice.getById(orgaoId);
            Tipo tipo = tiposervice.getById(tipoId);
            Usuario usuario = usuarioservice.getById(usuarioId);

            if (orgao == null || tipo == null || usuario == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro: Um ou mais parâmetros inválidos.");
            }

            Denuncia novaDenuncia = new Denuncia(ultimaDenuncia.getId() + 1, titulo, texto, urgencia, LocalDateTime.now(), orgao, tipo, usuario);
            denunciaservice.save(novaDenuncia);
            return ResponseEntity.ok("Denúncia cadastrada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao cadastrar denúncia: " + e.getMessage());
        }
    }


    @GetMapping("/get-all-orgaos")
    public ResponseEntity<Object> buscarTodosOrgaos()
    {
        return new ResponseEntity<>(orgaoservice.getAll(),HttpStatus.OK);
    }

    @GetMapping("/get-all-tipos")
    public ResponseEntity<Object> buscarTodosTipos()
    {
        return new ResponseEntity<>(tiposervice.getAll(),HttpStatus.OK);
    }

    @GetMapping("get-all-denuncia-cidadao")
    public ResponseEntity<Object> buscarDenuncias(@RequestParam("id") Long id)
    {
         return new ResponseEntity<>(denunciaservice.getAllByUsuId(id), HttpStatus.OK);
    }

    @GetMapping("get-feedback-by-denuncia-id")
    public ResponseEntity<Object> buscarFeedbackByDenuncia(@RequestParam("id") Long id)
    {
        return new ResponseEntity<>(feedbackService.getByDenunciaId(id),HttpStatus.OK);
    }
}
