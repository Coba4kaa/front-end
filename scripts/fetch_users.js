document.addEventListener("DOMContentLoaded", () => {
    const currentUserContainer = document.getElementById("current-user");
    const suggestedUsersContainer = document.getElementById("suggested-users");
    const preloaderProfile = document.getElementById("preloader-profile");
    const preloaderSuggestions = document.getElementById("preloader-suggestions");

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
            preloaderProfile.classList.add("hidden");
        }
    };

    const renderCurrentUser = (user) => {
        currentUserContainer.innerHTML = `
            <h4>${user.name} (${user.username})</h4>
            <p>Email: <a href="mailto:${user.email}">${user.email}</a></p>
            <p>Phone: ${user.phone}</p>
            <p>Website: <a href="http://${user.website}" target="_blank">${user.website}</a></p>
            <p>Company: ${user.company.name}</p>
            <p>Address: ${user.address.city}, ${user.address.street}</p>
        `;
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
            preloaderSuggestions.classList.add("hidden");
        }
    };

    const renderSuggestedUsers = (users) => {
        if (!users.length) {
            showError(suggestedUsersContainer, "Нет рекомендаций.");
            return;
        }

        suggestedUsersContainer.innerHTML = users.map(user => `
            <div class="user-suggestion">
                <h4>${user.name}</h4>
                <p>${user.company.name}</p>
            </div>
        `).join("");
    };

    fetchCurrentUser();
    fetchSuggestedUsers();
});
