document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "https://cubstart-final-project.onrender.com";

    async function fetchClothes() {
        try {
            const response = await fetch(BASE_URL);

            if (!response.ok) {
                throw new Error(`Failed to fetch clothes: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("Clothes data:", data);
            renderClothes(data);
        } catch (error) {
            console.error("Error fetching clothes:", error);
        }
    }

    function renderClothes(clothes) {
        const clothesContainer = document.getElementById("clothes-container");
        clothesContainer.innerHTML = "";
        clothes.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("clothing-item");

            itemDiv.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Brand: ${item.brand || "N/A"}</p>
                <p>Color: ${item.color || "N/A"}</p>
                <p>Tags: ${item.tags ? item.tags.join(", ") : "None"}</p>
                <p>Price: $${item.price || "N/A"}</p>
                <p>Time of Purchase: ${item.time_of_purchase || "N/A"}</p>
                <p>Dry Wash: ${item.needs_dry_washing ? "Yes" : "No"}</p>
            `;

            clothesContainer.appendChild(itemDiv);
        });
        if (clothes.length === 0) {
            clothesContainer.innerHTML = "<p>No clothes found.</p>";
            return;
        }
    }

    async function addClothingItem(clothing) {
        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(clothing),
            });

            if (!response.ok) {
                throw new Error(`Failed to add clothing item: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Added Clothing Item:", data);

            fetchClothes();
        } catch (error) {
            console.error("Error adding clothing item:", error);
        }
    }

    fetchClothes();

    // Event listener for applying tag filter
    document.getElementById("apply-filter").addEventListener("click", () => {
        const tags = document.getElementById("tag-filter").value.split(",").map(tag => tag.trim());
        if (tags.length === 0 || tags[0] === "") {
            alert("Please enter at least one tag.");
            return;
        }
        fetchFilteredAndSortedClothes(tags, null, null);
    });

    // Event listener for applying sort
    document.getElementById("apply-sort").addEventListener("click", () => {
        const sortOption = document.getElementById("sort-options").value;
        let sort = null, order = null;

        if (sortOption === "price-asc") {
            sort = "price";
            order = "asc";
        } else if (sortOption === "price-desc") {
            sort = "price";
            order = "desc";
        } else if (sortOption === "time-newest") {
            sort = "time_of_purchase";
            order = "desc";
        } else if (sortOption === "time-oldest") {
            sort = "time_of_purchase";
            order = "asc";
        }

        fetchFilteredAndSortedClothes(null, sort, order);
    });

    const uploadForm = document.getElementById("upload-form");
    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const clothing = {
            name: document.getElementById("name").value,
            brand: document.getElementById("brand").value,
            color: document.getElementById("color").value,
            texture: document.getElementById("texture").value,
            tags: document.getElementById("tags").value.split(","),
            price: parseFloat(document.getElementById("price").value),
            time_of_purchase: document.getElementById("time-of-purchase").value,
            needs_dry_washing: document.getElementById("needs-dry-washing").checked,
            image_url: document.getElementById("image").value,
        };

        addClothingItem(clothing);
        uploadForm.reset();
    });
});