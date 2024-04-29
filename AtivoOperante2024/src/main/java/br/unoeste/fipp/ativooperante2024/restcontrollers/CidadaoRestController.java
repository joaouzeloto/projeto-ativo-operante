package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import br.unoeste.fipp.ativooperante2024.services.DenunciaService;
import br.unoeste.fipp.ativooperante2024.services.OrgaoService;
import br.unoeste.fipp.ativooperante2024.services.TipoService;
import br.unoeste.fipp.ativooperante2024.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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

    @GetMapping("teste-conexao")
    public String testeConexao()
    {
        return "conectado";
    }

    @GetMapping("cadastra-usuario")
    public void cadastrarUsuario(@RequestParam(value="cpf") String cpf,@RequestParam(value = "email") String email,
                                                    @RequestParam(value= "senha") int senha)
    {
        List<Usuario> lista =  usuarioservice.getAll();
        Usuario aux = lista.get(lista.size()-1);
        salvarUsuario(new Usuario(aux.getId()+1,cpf,email,senha,0));
    }

    @GetMapping("/add-usuario")
    public ResponseEntity<Object> salvarUsuario(@RequestBody Usuario usuario)
    {
        Usuario novo;
        novo = usuarioservice.save(usuario);
        return  new ResponseEntity<>(novo, HttpStatus.OK);
    }

    @GetMapping("cadastrar-denuncia")
    public void cadastraDenuncia(@RequestParam("titulo") String titulo,@RequestParam("texto")String texto,
                                 @RequestParam("urgencia") int urgencia, @RequestParam("orgao") long orgao, @RequestParam("tipo") long tipo,
                                 @RequestParam("usuario") long usu)
    {
        List<Denuncia> denuncias = denunciaservice.getAll();
        Denuncia aux = denuncias.get(denuncias.size()-1);
        denunciaservice.save(new Denuncia(aux.getId()+1,titulo,texto,urgencia, LocalDate.now(),orgaoservice.getById(orgao),
                tiposervice.getById(tipo),usuarioservice.getById(usu)));
    }

}
