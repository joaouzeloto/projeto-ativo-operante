package br.unoeste.fipp.ativooperante2024.services;

import br.unoeste.fipp.ativooperante2024.db.entities.Tipo;
import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import br.unoeste.fipp.ativooperante2024.db.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService
{
    @Autowired
    UsuarioRepository repo;

    public Usuario save(Usuario usuario)
    {
        return  repo.save(usuario);
    }

    public Usuario getByEmail(String email)
    {
        return repo.getUsuarioByEmail(email);
    }

    public Usuario getById(Long id)
    {
        Usuario usuario = repo.findById(id).get();
        return usuario;
    }

    public List<Usuario> getAll()
    {
        return repo.findAll();
    }

    public boolean delete(long id)
    {
        try
        {
            repo.deleteById(id);
            return true;
        }
        catch (Exception e)
        {
            return false;
        }
    }

}
