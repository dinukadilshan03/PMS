package com.beni.backend.packages.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "packages")
public class Package {

    @Id
    private String id;
    private String name;
    private List<String> servicesIncluded;
    private AdditionalItems additionalItems;
    private int investment;  // The price in LKR
    private String packageType;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getServicesIncluded() {
        return servicesIncluded;
    }

    public void setServicesIncluded(List<String> servicesIncluded) {
        this.servicesIncluded = servicesIncluded;
    }

    public AdditionalItems getAdditionalItems() {
        return additionalItems;
    }

    public void setAdditionalItems(AdditionalItems additionalItems) {
        this.additionalItems = additionalItems;
    }

    public int getInvestment() {
        return investment;
    }

    public void setInvestment(int investment) {
        this.investment = investment;
    }

    public String getPackageType() {
        return packageType;
    }

    public void setPackageType(String packageType) {
        this.packageType = packageType;
    }

    // Nested AdditionalItems class
    public static class AdditionalItems {
        private String editedImages;
        private String uneditedImages;
        private List<Album> albums;
        private List<FramedPortrait> framedPortraits;
        private int thankYouCards;

        // Getters and Setters
        public String getEditedImages() {
            return editedImages;
        }

        public void setEditedImages(String editedImages) {
            this.editedImages = editedImages;
        }

        public String getUneditedImages() {
            return uneditedImages;
        }

        public void setUneditedImages(String uneditedImages) {
            this.uneditedImages = uneditedImages;
        }

        public List<Album> getAlbums() {
            return albums;
        }

        public void setAlbums(List<Album> albums) {
            this.albums = albums;
        }

        public List<FramedPortrait> getFramedPortraits() {
            return framedPortraits;
        }

        public void setFramedPortraits(List<FramedPortrait> framedPortraits) {
            this.framedPortraits = framedPortraits;
        }

        public int getThankYouCards() {
            return thankYouCards;
        }

        public void setThankYouCards(int thankYouCards) {
            this.thankYouCards = thankYouCards;
        }
    }

    // Nested Album class
    public static class Album {
        private String size;
        private String type;
        private int spreadCount;

        // Getters and Setters
        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public int getSpreadCount() {
            return spreadCount;
        }

        public void setSpreadCount(int spreadCount) {
            this.spreadCount = spreadCount;
        }
    }

    // Nested FramedPortrait class
    public static class FramedPortrait {
        private String size;
        private int quantity;

        // Getters and Setters
        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}
