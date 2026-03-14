$(document).ready(function() {
    const API_URL = 'http://localhost:8080/api/ktp';
    let deleteId = null;

    // Load data
    loadKtpData();

    // Submit form
    $('#ktpForm').on('submit', function(e) {
        e.preventDefault();
        saveKtp();
    });

    // Reset form
    $('#resetBtn').on('click', function() {
        resetForm();
    });

    // Search functionality
    $('#searchInput').on('keyup', function() {
        filterTable($(this).val());
    });

    // Modal handlers
    $('#confirmDelete').on('click', function() {
        if (deleteId) {
            deleteKtp(deleteId);
        }
        closeDeleteModal();
    });

    $('#cancelDelete').on('click', function() {
        closeDeleteModal();
    });

    $(window).on('click', function(e) {
        if ($(e.target).is('#deleteModal')) {
            closeDeleteModal();
        }
    });

    function loadKtpData() {
        showLoading(true);

        $.ajax({
            url: API_URL,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                displayKtpData(data);
                updateStats(data);
                showToast('Data berhasil dimuat', 'success');
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                showToast('Gagal memuat data', 'error');
                $('#ktpTableBody').html('<tr><td colspan="7" class="text-center">Gagal memuat data</td></tr>');
            },
            complete: function() {
                showLoading(false);
            }
        });
    }

    function displayKtpData(data) {
        let html = '';

        if (data && data.length > 0) {
            $.each(data, function(index, item) {
                let tanggalLahir = '';
                if (item.tanggalLahir) {
                    const date = new Date(item.tanggalLahir);
                    tanggalLahir = date.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    });
                }

                html += '<tr>';
                html += '<td>' + (index + 1) + '</td>';
                html += '<td><span class="ktp-number">' + formatKTP(item.nomorKtp) + '</span></td>';
                html += '<td><strong>' + (item.namaLengkap || '-') + '</strong></td>';
                html += '<td>' + (item.alamat || '-') + '</td>';
                html += '<td>' + tanggalLahir + '</td>';
                html += '<td><span class="gender-badge ' + (item.jenisKelamin === 'Laki-laki' ? 'male' : 'female') + '">' +
                       (item.jenisKelamin || '-') + '</span></td>';
                html += '<td class="actions">';
                html += '<button class="btn-edit" onclick="editKtp(' + item.id + ')"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button class="btn-delete" onclick="showDeleteModal(' + item.id + ')"><i class="fas fa-trash"></i> Hapus</button>';
                html += '</td>';
                html += '</tr>';
            });
        } else {
            html = '<tr><td colspan="7" class="text-center"><i class="fas fa-folder-open"></i> Tidak ada data</td></tr>';
        }

        $('#ktpTableBody').html(html);
    }

    function updateStats(data) {
        $('#totalData').text(data.length);

        const laki = data.filter(item => item.jenisKelamin === 'Laki-laki').length;
        const perempuan = data.filter(item => item.jenisKelamin === 'Perempuan').length;

        $('#totalLaki').text(laki);
        $('#totalPerempuan').text(perempuan);
    }

    function filterTable(searchText) {
        searchText = searchText.toLowerCase();
        $('#ktpTableBody tr').each(function() {
            const rowText = $(this).text().toLowerCase();
            if (rowText.indexOf(searchText) === -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    }

    function saveKtp() {
        clearErrors();

        const ktpData = {
            nomorKtp: $('#nomorKtp').val(),
            namaLengkap: $('#namaLengkap').val(),
            alamat: $('#alamat').val(),
            tanggalLahir: $('#tanggalLahir').val(),
            jenisKelamin: $('#jenisKelamin').val()
        };

        if (!validateForm(ktpData)) {
            return;
        }

        const ktpId = $('#ktpId').val();
        const url = ktpId ? API_URL + '/' + ktpId : API_URL;
        const method = ktpId ? 'PUT' : 'POST';

        showLoading(true);

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(ktpData),
            success: function(response) {
                resetForm();
                loadKtpData();
                showToast('Data berhasil disimpan', 'success');
            },
            error: function(xhr, status, error) {
                console.error('Error:', xhr.responseText);

                if (xhr.status === 400 && xhr.responseJSON && xhr.responseJSON.errors) {
                    const errors = xhr.responseJSON.errors;
                    $.each(errors, function(field, message) {
                        $('#' + field).addClass('error');
                        $('#' + field + 'Error').text(message);
                    });
                    showToast('Mohon periksa kembali form Anda', 'error');
                } else if (xhr.status === 409) {
                    showToast('Nomor KTP sudah terdaftar', 'error');
                } else {
                    showToast('Gagal menyimpan data', 'error');
                }
            },
            complete: function() {
                showLoading(false);
            }
        });
    }

    function validateForm(data) {
        let isValid = true;

        // Nomor KTP validation
        if (!data.nomorKtp) {
            showFieldError('nomorKtp', 'Nomor KTP tidak boleh kosong');
            isValid = false;
        } else if (data.nomorKtp.length !== 16) {
            showFieldError('nomorKtp', 'Nomor KTP harus 16 digit');
            isValid = false;
        } else if (!/^\d+$/.test(data.nomorKtp)) {
            showFieldError('nomorKtp', 'Nomor KTP hanya boleh berisi angka');
            isValid = false;
        }

        // Nama validation
        if (!data.namaLengkap) {
            showFieldError('namaLengkap', 'Nama lengkap tidak boleh kosong');
            isValid = false;
        } else if (data.namaLengkap.length > 100) {
            showFieldError('namaLengkap', 'Nama lengkap maksimal 100 karakter');
            isValid = false;
        }

        // Alamat validation
        if (!data.alamat) {
            showFieldError('alamat', 'Alamat tidak boleh kosong');
            isValid = false;
        } else if (data.alamat.length > 255) {
            showFieldError('alamat', 'Alamat maksimal 255 karakter');
            isValid = false;
        }

        // Tanggal lahir validation
        if (!data.tanggalLahir) {
            showFieldError('tanggalLahir', 'Tanggal lahir tidak boleh kosong');
            isValid = false;
        } else {
            const selectedDate = new Date(data.tanggalLahir);
            const today = new Date();
            if (selectedDate > today) {
                showFieldError('tanggalLahir', 'Tanggal lahir harus di masa lalu');
                isValid = false;
            }
        }

        // Jenis kelamin validation
        if (!data.jenisKelamin) {
            showFieldError('jenisKelamin', 'Jenis kelamin harus dipilih');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(field, message) {
        $('#' + field).addClass('error');
        $('#' + field + 'Error').text(message);
    }

    function clearErrors() {
        $('.form-group input, .form-group select, .form-group textarea').removeClass('error');
        $('.error').text('');
    }

    function resetForm() {
        $('#ktpId').val('');
        $('#ktpForm')[0].reset();
        $('#submitBtn').html('<i class="fas fa-save"></i> Simpan Data');
        $('#formMode').text('Tambah Data');
        clearErrors();
    }

    function showLoading(show) {
        if (show) {
            $('#loading').show();
        } else {
            $('#loading').hide();
        }
    }

    function showToast(message, type) {
        const toast = $('#toast');
        toast.text(message);
        toast.removeClass('success error info');
        toast.addClass(type);
        toast.addClass('show');

        setTimeout(function() {
            toast.removeClass('show');
        }, 3000);
    }

    function closeDeleteModal() {
        $('#deleteModal').hide();
        deleteId = null;
    }

    window.showDeleteModal = function(id) {
        deleteId = id;
        $('#deleteModal').show();
    };

    function deleteKtp(id) {
        showLoading(true);

        $.ajax({
            url: API_URL + '/' + id,
            method: 'DELETE',
            success: function() {
                loadKtpData();
                showToast('Data berhasil dihapus', 'success');
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                showToast('Gagal menghapus data', 'error');
            },
            complete: function() {
                showLoading(false);
                closeDeleteModal();
            }
        });
    }

    window.editKtp = function(id) {
        showLoading(true);

        $.ajax({
            url: API_URL + '/' + id,
            method: 'GET',
            success: function(data) {
                $('#ktpId').val(data.id);
                $('#nomorKtp').val(data.nomorKtp);
                $('#namaLengkap').val(data.namaLengkap);
                $('#alamat').val(data.alamat);
                $('#tanggalLahir').val(data.tanggalLahir);
                $('#jenisKelamin').val(data.jenisKelamin);
                $('#submitBtn').html('<i class="fas fa-sync-alt"></i> Update Data');
                $('#formMode').text('Edit Data');

                $('html, body').animate({
                    scrollTop: $('.form-card').offset().top - 100
                }, 500);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                showToast('Gagal memuat data', 'error');
            },
            complete: function() {
                showLoading(false);
            }
        });
    };

    // Helper function to format KTP number
    function formatKTP(ktp) {
        if (!ktp) return '-';
        return ktp.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    }
});