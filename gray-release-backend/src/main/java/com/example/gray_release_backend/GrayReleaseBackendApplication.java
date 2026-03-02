package com.example.gray_release_backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.gray_release_backend.mapper")
public class GrayReleaseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(GrayReleaseBackendApplication.class, args);
	}

}
