package com.petify_v2.view;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.matcher.ViewMatchers.withId;

import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import com.petify_v2.R;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;


@RunWith(AndroidJUnit4.class)

public class LoginActivityTest {


    @Rule
    public ActivityScenarioRule<LoginActivity> activityRule
            = new ActivityScenarioRule<>(LoginActivity.class);
    private final LoginActivity loginActivity = null;

    @Test
    public void test_Login() {
        onView(withId(R.id.usernameEditText)).perform(typeText("anastasia"));

        onView(withId(R.id.passwordEditText)).perform(typeText("password"));

        onView(withId(R.id.btnConnect)).perform(click());
    }

}