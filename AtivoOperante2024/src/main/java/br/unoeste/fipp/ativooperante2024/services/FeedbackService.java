package br.unoeste.fipp.ativooperante2024.services;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Feedback;
import br.unoeste.fipp.ativooperante2024.db.repositories.DenunciaRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService
{
    @Autowired
    FeedbackRepository repo;

    public Feedback save(Feedback feedback){ return repo.save(feedback);}

    public Feedback getById(Long id)
    {
        Feedback feedback = repo.findById(id).get();
        return feedback;
    }

    public List<Feedback> getAll()
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
