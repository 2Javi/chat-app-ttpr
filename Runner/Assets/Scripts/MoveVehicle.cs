using UnityEngine;
using TMPro;

public class MoveVehicle : MonoBehaviour
{

    public float speed = 10f;
    [SerializeField] TextMeshProUGUI endScreenText;

    void Start()
    {

    }

    void Update()
    {
        transform.position += Vector3.back * speed * Time.deltaTime;

        DestroyCar();
    }
    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Bike"))
        {
            Time.timeScale = 0;
        }
    }

    private void DestroyCar()
    {
        if (transform.position.z < -70)
        {
            Destroy(gameObject);
        }
    }
}
