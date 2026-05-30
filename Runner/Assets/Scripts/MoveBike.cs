using UnityEngine;
using UnityEngine.InputSystem;

public class MoveBike : MonoBehaviour
{
    public float speed = 5f;

    void Update()
    {
        float input = 0f;
        if (Keyboard.current.aKey.isPressed || Keyboard.current.leftArrowKey.isPressed) input = -1f;
        if (Keyboard.current.dKey.isPressed || Keyboard.current.rightArrowKey.isPressed) input = 1f;

        transform.position += Vector3.right * input * speed * Time.deltaTime;
    }
}