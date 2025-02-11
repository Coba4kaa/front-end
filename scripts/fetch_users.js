document.addEventListener("DOMContentLoaded", () => {
    const currentUserContainer = document.querySelector("#user-profile-container");
    const suggestedUsersContainer = document.querySelector("#suggested-users-container");
    const preloaderProfile = document.querySelector("#preloader-profile");
    const preloaderSuggestions = document.querySelector("#preloader-suggestions");
    const profileTemplate = document.querySelector("#user-profile-template");
    const suggestionTemplate = document.querySelector("#user-suggestion-template");

    const showError = (container, message) => {
        container.innerHTML = `<div class="error">⚠ ${message}</div>`;
    };

    const fetchCurrentUser = async () => {
        try {
            const randomUserId = Math.floor(Math.random() * 10) + 1;
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${randomUserId}`);

            if (!response.ok) {
                throw new Error(`Ошибка загрузки данных: ${response.status}`);
            }

            const user = await response.json();
            renderCurrentUser(user);
        } catch (error) {
            console.error(error);
            showError(currentUserContainer, "Не удалось загрузить профиль.");
        } finally {
            if (preloaderProfile) preloaderProfile.classList.add("hide");
        }
    };

    const renderCurrentUser = (user) => {
        const userCard = profileTemplate.content.cloneNode(true);
        userCard.querySelector(".user-name").textContent = `${user.name} (${user.username})`;
        userCard.querySelector(".user-email").textContent = user.email;
        userCard.querySelector(".user-email").href = `mailto:${user.email}`;
        userCard.querySelector(".user-phone").textContent = user.phone;
        userCard.querySelector(".user-website").textContent = user.website;
        userCard.querySelector(".user-website").href = `http://${user.website}`;
        userCard.querySelector(".user-company").textContent = user.company.name;
        userCard.querySelector(".user-address").textContent = `${user.address.city}, ${user.address.street}`;

        currentUserContainer.innerHTML = "";
        currentUserContainer.appendChild(userCard);
    };

    const fetchSuggestedUsers = async () => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users`);

            if (!response.ok) {
                throw new Error(`Ошибка загрузки данных: ${response.status}`);
            }

            const users = await response.json();
            renderSuggestedUsers(users.slice(0, 10));
        } catch (error) {
            console.error(error);
            showError(suggestedUsersContainer, "Не удалось загрузить рекомендации.");
        } finally {
            if (preloaderSuggestions) preloaderSuggestions.classList.add("hide");
        }
    };

    const renderSuggestedUsers = (users) => {
        if (!users.length) {
            showError(suggestedUsersContainer, "Нет рекомендаций.");
            return;
        }

        suggestedUsersContainer.innerHTML = "";
        users.forEach((user) => {
            const suggestionCard = suggestionTemplate.content.cloneNode(true);
            suggestionCard.querySelector(".suggestion-name").textContent = user.name;
            suggestionCard.querySelector(".suggestion-company").textContent = user.company.name;
            suggestedUsersContainer.appendChild(suggestionCard);
        });
    };

    fetchCurrentUser();
    fetchSuggestedUsers();
});
