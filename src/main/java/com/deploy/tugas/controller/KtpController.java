package com.deploy.tugas.controller;  // Package harus seperti ini

import com.deploy.tugas.model.dto.KtpDto;
import com.deploy.tugas.model.dto.KtpRequest;
import com.deploy.tugas.service.KtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ktp")  // Gunakan /api/ktp
@CrossOrigin
public class KtpController {

    @Autowired
    private KtpService service;

    // TAMBAHKAN METHOD TEST INI
    @GetMapping("/test")
    public String test() {
        return "KtpController is working!";
    }

    @PostMapping
    public KtpDto create(@RequestBody KtpRequest request){
        return service.create(request);
    }

    @GetMapping
    public List<KtpDto> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public KtpDto getById(@PathVariable Integer id){
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public KtpDto update(@PathVariable Integer id,@RequestBody KtpRequest request){
        return service.update(id,request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}