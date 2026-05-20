using UnityEngine;
using UnityEngine.InputSystem;

public class ScooterController : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 10f;
    [SerializeField] private float turnSpeed = 10f;

    private Vector2 moveInput;
    private InputSystem_Actions inputActions;

    private void Awake()
    {
        inputActions = new InputSystem_Actions();
    }

    private void OnEnable()
    {
        inputActions.Player.Enable();
    }

    private void OnDisable()
    {
        inputActions.Player.Disable();
    }

    private void Update()
    {
        moveInput = inputActions.Player.Move.ReadValue<Vector2>();

        // Forward/back movement (W/S)
        float move = moveInput.y * moveSpeed * Time.deltaTime;
        transform.Translate(Vector3.forward * move);

        // Turning (A/D)
        float turn = moveInput.x * turnSpeed * Time.deltaTime;
        transform.Translate(Vector3.right * turn);
    }
}