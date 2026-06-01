using UnityEngine;
using UnityEngine.InputSystem;
using TMPro;

public class MoveBike : MonoBehaviour
{
    public float speed = 5f;
    public float distancedTraveled = 0f;

    public float milesLeft = 2000f;
    [SerializeField] TextMeshProUGUI endScreenText;

    void Update()
    {
        float input = 0f;
        if (Keyboard.current.aKey.isPressed || Keyboard.current.leftArrowKey.isPressed) input = -1f;
        if (Keyboard.current.dKey.isPressed || Keyboard.current.rightArrowKey.isPressed) input = 1f;

        transform.position += Vector3.right * input * speed * Time.deltaTime;

        distancedTraveled += speed * Time.deltaTime;
        milesLeft -= distancedTraveled * Time.deltaTime;

        if (PlayerWin())
        {
            endScreenText.gameObject.SetActive(true);
            endScreenText.text = "Message Delivered";
            Time.timeScale = 0;
        }
    }

    private bool PlayerWin()
    {
        if (milesLeft <= 0)
        {
            return true;
        }
        return false;
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Vehicle"))
        {
            endScreenText.gameObject.SetActive(true);
            endScreenText.text = "Try again";
        }
    }
}