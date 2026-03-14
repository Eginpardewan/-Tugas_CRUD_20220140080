package com.deploy.tugas.mapper;

import com.deploy.tugas.model.dto.KtpDto;
import com.deploy.tugas.model.dto.KtpRequest;
import com.deploy.tugas.model.entity.Ktp;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface KtpMapper {
    KtpMapper MAPPER = Mappers.getMapper(KtpMapper.class);
    KtpDto toKtpDtoData(Ktp ktp);
    Ktp toEntity(KtpRequest request);
}
