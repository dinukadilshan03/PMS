//package com.beni.backend;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Value("${frontend.port}")  // Fetch the value from environment variables or properties
//    private String frontendPort;
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        // Dynamically set the frontend URL with the port
//        String frontendUrl = "http://localhost:" + frontendPort;
//
//        registry.addMapping("/**")
//                .allowedOrigins(frontendUrl,"http://localhost:3000")  // Allow requests from frontend
//                .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH")
//                .allowedHeaders("*")
//                .allowCredentials(true);
//    }
//}
