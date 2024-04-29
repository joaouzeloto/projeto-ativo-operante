package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.*;
import br.unoeste.fipp.ativooperante2024.db.repositories.DenunciaRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.FeedbackRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.OrgaoRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.TipoRepository;
import br.unoeste.fipp.ativooperante2024.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("apis/adm/")
public class AdminRestController {

    @Autowired
    FeedbackRepository feedbackrepository;

    @Autowired
    OrgaoService orgaoservice;

    @Autowired
    DenunciaService denunciaservice;

    @Autowired
    UsuarioService usuarioservice;

    @Autowired
    TipoService tiposervice;

    @Autowired
    FeedbackService feedbackservice;

    @GetMapping("teste-conexao")
    public String testeConexao()
    {
        return "conectado";
    }

    // demais apis
    @GetMapping("/delete-orgao")
    public ResponseEntity<Object> excluirOrgao(@RequestParam(value="id") Long id)
    {
        if(orgaoservice.delete(id))
                return new ResponseEntity<>("",HttpStatus.OK);
        else
                return new ResponseEntity<>("",HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/add-orgao")
    public ResponseEntity<Object> salvarOrgao (@RequestBody Orgao orgao)
    {
        Orgao novo;
        novo = orgaoservice.save(orgao);
        return new ResponseEntity<>(novo, HttpStatus.OK);
    }

    @GetMapping("/get-orgao")
    public ResponseEntity<Object> buscarUmOrgao(@RequestParam(value="id") Long id)
    {
        Orgao orgao;
        orgao = orgaoservice.getById(id);
        return new ResponseEntity<>(orgao,HttpStatus.OK);
    }
    @GetMapping("/get-all-orgaos")
    public ResponseEntity<Object> buscarTodosOrgaos()
    {
        return new ResponseEntity<>(orgaoservice.getAll(),HttpStatus.OK);
    }

    @GetMapping("/get-denuncia")
    public ResponseEntity<Object> buscarUmaDenuncia(@RequestParam(value="id") Long id)
    {
        Denuncia denuncia;
        denuncia = denunciaservice.getById(id);
        return new ResponseEntity<>(denuncia,HttpStatus.OK);
    }

    @GetMapping("/add-denuncia")
    public ResponseEntity<Object> salvarDenuncia(@RequestBody Denuncia denuncia)
    {
        Denuncia novo;
        novo = denunciaservice.save(denuncia);
        return  new ResponseEntity<>(novo, HttpStatus.OK);
    }

    @GetMapping("/get-all-denuncias")
    public ResponseEntity<Object> buscarTodasDenuncias()
    {
        return new ResponseEntity<>(denunciaservice.getAll(),HttpStatus.OK);
    }

    @GetMapping("/delete-denuncias")
    public ResponseEntity<Object> excluirDenuncia(@RequestParam(value="id") Long id)
    {
        if(denunciaservice.delete(id))
            return new ResponseEntity<>("",HttpStatus.OK);
        else
            return new ResponseEntity<>("",HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/get-tipo")
    public ResponseEntity<Object> buscarUmTipo(@RequestParam(value="id") Long id)
    {
        Tipo tipo;
        tipo = tiposervice.getById(id);
        return new ResponseEntity<>(tipo,HttpStatus.OK);
    }

    @GetMapping("/add-tipo")
    public ResponseEntity<Object> salvarTipo(@RequestBody Tipo tipo)
    {
        Tipo novo;
        novo = tiposervice.save(tipo);
        return  new ResponseEntity<>(novo, HttpStatus.OK);
    }

    @GetMapping("/get-all-tipos")
    public ResponseEntity<Object> buscarTodosTipos()
    {
        return new ResponseEntity<>(tiposervice.getAll(),HttpStatus.OK);
    }

    @GetMapping("/delete-tipo")
    public ResponseEntity<Object> excluirTipo(@RequestParam(value="id") Long id)
    {
        if(tiposervice.delete(id))
            return new ResponseEntity<>("",HttpStatus.OK);
        else
            return new ResponseEntity<>("",HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/get-usuario")
    public ResponseEntity<Object> buscarUmUsuario(@RequestParam(value="id") Long id)
    {
        Usuario usuario;
        usuario = usuarioservice.getById(id);
        return new ResponseEntity<>(usuario,HttpStatus.OK);
    }

    @GetMapping("/add-usuario")
    public ResponseEntity<Object> salvarUsuario(@RequestBody Usuario usuario)
    {
        Usuario novo;
        novo = usuarioservice.save(usuario);
        return  new ResponseEntity<>(novo, HttpStatus.OK);
    }

    @GetMapping("/get-all-usuarios")
    public ResponseEntity<Object> buscarTodosUsuarios()
    {
        return new ResponseEntity<>(usuarioservice.getAll(),HttpStatus.OK);
    }

    @GetMapping("/delete-usuario")
    public ResponseEntity<Object> excluirUsuario(@RequestParam(value="id") Long id)
    {
        if(usuarioservice.delete(id))
            return new ResponseEntity<>("",HttpStatus.OK);
        else
            return new ResponseEntity<>("",HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/cadastra-feedback")
    public void cadastraFeedback(@RequestParam(value = "texto") String texto,@RequestParam(value = "denuncia") Long denuncia)
    {
        List<Feedback> listaFee = feedbackrepository.findAll();
        if(listaFee!=null)
        {
            feedbackservice.save(new Feedback(listaFee.get(listaFee.size()-1).getId()+1,texto,denunciaservice.getById(denuncia)));
        }
        else
        {
            feedbackservice.save(new Feedback(1L,texto,denunciaservice.getById(denuncia)));
        }

    }
}
