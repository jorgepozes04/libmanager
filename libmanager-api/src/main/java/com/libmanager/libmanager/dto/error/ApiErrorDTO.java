package com.libmanager.libmanager.dto.error;

import java.time.LocalDateTime;

public record ApiErrorDTO(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path
) {
}
