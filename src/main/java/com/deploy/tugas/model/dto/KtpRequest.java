package com.deploy.tugas.model.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KtpRequest {

    @NotBlank(message = "Nomor KTP tidak boleh kosong")
    @Size(min = 16, max = 16, message = "Nomor KTP harus 16 digit")
    @Pattern(regexp = "^[0-9]+$", message = "Nomor KTP hanya boleh berisi angka")
    private String nomorKtp;

    @NotBlank(message = "Nama lengkap tidak boleh kosong")
    @Size(max = 100, message = "Nama lengkap maksimal 100 karakter")
    private String namaLengkap;

    @NotBlank(message = "Alamat tidak boleh kosong")
    @Size(max = 255, message = "Alamat maksimal 255 karakter")
    private String alamat;

    @NotNull(message = "Tanggal lahir tidak boleh kosong")
    @Past(message = "Tanggal lahir harus di masa lalu")
    private LocalDate tanggalLahir;

    @NotBlank(message = "Jenis kelamin tidak boleh kosong")
    @Pattern(regexp = "^(Laki-laki|Perempuan)$", message = "Jenis kelamin harus Laki-laki atau Perempuan")
    private String jenisKelamin;
}