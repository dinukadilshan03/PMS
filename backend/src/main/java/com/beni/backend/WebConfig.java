//package com.beni.backend;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        // Allow requests from the Next.js frontend (on port 3000)
//        registry.addMapping("/**")
//
//                .allowedOrigins("http://localhost:3000")  // Allow Next.js frontend on localhost:3000
//
//                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allowed HTTP methods
//                .allowedHeaders("*")  // Allow all headers
//                .allowCredentials(true);  // Allow credentials (cookies, authorization headers, etc.)
//    }
//}
