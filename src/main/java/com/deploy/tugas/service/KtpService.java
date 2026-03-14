package com.deploy.tugas.service;

import com.deploy.tugas.model.dto.KtpDto;
import com.deploy.tugas.model.dto.KtpRequest;

import java.util.List;

public interface KtpService {

    KtpDto create(KtpRequest request);

    List<KtpDto> getAll();

    KtpDto getById(Integer id);

    KtpDto update(Integer id, KtpRequest request);

    void delete(Integer id);
}