package br.unoeste.fipp.ativooperante2024.services;

import br.unoeste.fipp.ativooperante2024.db.entities.Orgao;
import br.unoeste.fipp.ativooperante2024.db.repositories.OrgaoRepository;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrgaoService
{
    @Autowired
    private OrgaoRepository repo;

    public Orgao save(Orgao orgao)
    {
        return  repo.save(orgao);
    }

    public Orgao getById(Long id)
    {
        Orgao orgao = repo.findById(id).get();
        return orgao;
    }

    public List<Orgao> getAll()
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
