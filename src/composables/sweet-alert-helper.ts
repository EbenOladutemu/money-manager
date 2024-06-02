import Swal from 'sweetalert2'

export function useSweetAlert() {
  async function alert(title: string, text: any, icon: any) {
    Swal.fire({
      title,
      text,
      icon
    })
  }

  return { alert }
}
