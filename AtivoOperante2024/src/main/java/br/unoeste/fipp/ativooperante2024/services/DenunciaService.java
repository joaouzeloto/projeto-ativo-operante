package br.unoeste.fipp.ativooperante2024.services;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Orgao;
import br.unoeste.fipp.ativooperante2024.db.repositories.DenunciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DenunciaService
{
    @Autowired
    DenunciaRepository repo;

    public Denuncia save(Denuncia denuncia){ return repo.save(denuncia);}

    public Denuncia getById(Long id)
    {
        Denuncia denuncia = repo.findById(id).get();
        return denuncia;
    }

    public List<Denuncia> getAll()
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
