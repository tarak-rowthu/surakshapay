package com.surakshapay.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.surakshapay")
@EnableScheduling
public class SurakshaPayApplication {

	public static void main(String[] args) {
		SpringApplication.run(SurakshaPayApplication.class, args);
	}

}
