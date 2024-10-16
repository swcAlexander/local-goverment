#include <iostream>
#include <fstream>
#include <nlohmann/json.hpp>
#include <vector>

using json = nlohmann::json;

struct User {
    std::string name;
    std::string password;
    std::vector<std::string> todo;
    std::vector<std::string> progress;

    
    json to_json() const {
        return json{{"name", name}, {"password", password}, {"todo", todo}, {"progress", progress}};
    }

    static User from_json(const json& j) {
        User user;
        j.at("name").get_to(user.name);
        j.at("password").get_to(user.password);
        j.at("todo").get_to(user.todo);
        j.at("progress").get_to(user.progress);
        return user;
    }
};

json read_json(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Could not open file");
    }
    json j;
    file >> j;
    return j;
}

void write_json(const std::string& filename, const json& j) {
    std::ofstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Could not open file");
    }
    file << j.dump(4);
}

void add_user(json& j, const User& user) {
    j.push_back(user.to_json());
}

void remove_user(json& j, const std::string& name) {
    for (auto it = j.begin(); it != j.end(); ++it) {
        if (it->at("name") == name) {
            j.erase(it);
            break;
        }
    }
}

void update_user(json& j, const std::string& name, const std::string& new_password) {
    for (auto& user : j) {
        if (user["name"] == name) {
            user["password"] = new_password;
            break;
        }
    }
}

void update_todo(json& j, const std::string& name, const std::vector<std::string>& new_todo) {
    for (auto& user : j) {
        if (user["name"] == name) {
            user["todo"] = new_todo;
            break;
        }
    }
}


void update_progress(json& j, const std::string& name, const std::vector<std::string>& new_progress) {
    for (auto& user : j) {
        if (user["name"] == name) {
            user["progress"] = new_progress;
            break;
        }
    }
}

int main() {
    try {
        std::string filename = "users.json";
        json j = read_json(filename);

        User newUser{"newuser@gmail.com", "newpassword", {"task1", "task2"}, {"in_progress"}};
        add_user(j, newUser);

        update_user(j, "svcalexander@gmail.com", "newpassword123");

        update_todo(j, "svcalexander@gmail.com", {"new todo item"});

        update_progress(j, "svcalexander@gmail.com", {"new progress item"});

        remove_user(j, "newuser@gmail.com");

        write_json(filename, j);

        std::cout << "JSON successfully updated." << std::endl;

    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
    }

    return 0;
}