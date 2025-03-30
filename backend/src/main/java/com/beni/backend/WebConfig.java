
package com.beni.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")


                .allowedOrigins(frontendUrl,"http://localhost:3000","http://localhost:3002")  // Allow requests from frontend

                .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH")

                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:D:/Sliit/2nd Year 2nd Semester/ITP/PMS/backend/uploads/")
                .setCachePeriod(3600);

    }
}

