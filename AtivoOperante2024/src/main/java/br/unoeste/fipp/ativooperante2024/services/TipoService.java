package br.unoeste.fipp.ativooperante2024.services;

import br.unoeste.fipp.ativooperante2024.db.entities.Orgao;
import br.unoeste.fipp.ativooperante2024.db.entities.Tipo;
import br.unoeste.fipp.ativooperante2024.db.repositories.TipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoService
{
    @Autowired
    TipoRepository repo;

    public Tipo save(Tipo tipo)
    {
        return  repo.save(tipo);
    }

    public Tipo getById(Long id)
    {
        Tipo tipo = repo.findById(id).get();
        return tipo;
    }

    public List<Tipo> getAll()
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
