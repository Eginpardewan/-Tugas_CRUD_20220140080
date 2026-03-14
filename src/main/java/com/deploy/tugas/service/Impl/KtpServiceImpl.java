package com.deploy.tugas.service.Impl;

import com.deploy.tugas.model.dto.KtpDto;
import com.deploy.tugas.model.dto.KtpRequest;
import com.deploy.tugas.model.entity.Ktp;
import com.deploy.tugas.repository.KtpRepository;
import com.deploy.tugas.service.KtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KtpServiceImpl implements KtpService {

    @Autowired
    private KtpRepository repository;

    @Override
    public KtpDto create(KtpRequest request) {

        if(repository.findByNomorKtp(request.getNomorKtp()).isPresent()){
            throw new RuntimeException("Nomor KTP sudah ada");
        }

        Ktp ktp = Ktp.builder()
                .nomorKtp(request.getNomorKtp())
                .namaLengkap(request.getNamaLengkap())
                .alamat(request.getAlamat())
                .tanggalLahir(request.getTanggalLahir())
                .jenisKelamin(request.getJenisKelamin())
                .build();

        repository.save(ktp);

        return mapToDto(ktp);
    }

    @Override
    public List<KtpDto> getAll() {

        return repository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public KtpDto getById(Integer id) {

        Ktp ktp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data tidak ditemukan"));

        return mapToDto(ktp);
    }

    @Override
    public KtpDto update(Integer id, KtpRequest request) {

        Ktp ktp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data tidak ditemukan"));

        ktp.setNomorKtp(request.getNomorKtp());
        ktp.setNamaLengkap(request.getNamaLengkap());
        ktp.setAlamat(request.getAlamat());
        ktp.setTanggalLahir(request.getTanggalLahir());
        ktp.setJenisKelamin(request.getJenisKelamin());

        repository.save(ktp);

        return mapToDto(ktp);
    }

    @Override
    public void delete(Integer id) {

        Ktp ktp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data tidak ditemukan"));

        repository.delete(ktp);
    }

    private KtpDto mapToDto(Ktp ktp){

        KtpDto dto = new KtpDto();

        dto.setId(ktp.getId());
        dto.setNomorKtp(ktp.getNomorKtp());
        dto.setNamaLengkap(ktp.getNamaLengkap());
        dto.setAlamat(ktp.getAlamat());
        dto.setTanggalLahir(ktp.getTanggalLahir());
        dto.setJenisKelamin(ktp.getJenisKelamin());

        return dto;
    }
}